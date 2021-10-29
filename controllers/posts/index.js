'use-strict'

import util from "util";
import { prisma } from "../../services/db.js";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";

export const createPost = async (req, res) => {
    const storage = multer.memoryStorage();
    const upload = multer({
        storage: storage,
        limits: { fileSize: 52428800 },
        fileFilter: (req, file, cb) => {
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false)
                // Invalid file type error.
                let fileTypeError = new Error("Only png, jpg, jpeg files are allowed.");
                fileTypeError.code = "INVALID_FILE_TYPE";
                return cb(fileTypeError);
            }
        }
    });

    // Promisifying multer.
    const uploadFiles = upload.array('images', 10);
    let parseFiles = util.promisify(uploadFiles);

    await parseFiles(req, res)
        .then(async ctx => {

            // console.log(req.files[0]);

            let promises = req.files.map(file => {
                return new Promise(async (resolve, reject) => {
                    await sharp(file.buffer).jpeg({ mozjpeg: true }).toFile('processed_images/' + file.originalname)
                        .then(ctx => {
                            resolve(true);
                        })
                        .catch(err => { reject(err) });
                });
            });

            let result = await Promise.all(promises);

            // await sharp(req.files[0].buffer).grayscale().toFile("test.jpg");

            res.status(200).json({ ...req.body });

        }).catch(err => {
            // 
            console.log(err.code);
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(413).json({ "message": "Files too large." })
            } else if (err.code === "INVALID_FILE_TYPE") {
                return res.status(415).json({ "message": "Invalid file type." });
            }
        });
}

export const deletePost = async (req, res) => {
    const post_id = req.params.post_id;
    const user_id = req.session.user_id;


    if (!post_id || !user_id) {
        return res.status(400).json({ "status": "Bad Request." })
    }

    const post = await prisma.post.findFirst({
        where: {
            id: post_id,
            user_id: user_id // Do not remove. Needs this filter to filter query with user_id.
        }, include: {
            media_files: true
        }
    });

    // When post with that id is not found.
    if (!post) {

        return res.status(404).json({ "status": "User post not found." });

    } else if (post.user_id !== user_id) {

        // Throw warning when user tries to delete another user's post
        // Log the event.
        return res.status(401).json({ "status": "Unauthorized", "message": "Event logged." })

    } else if (post.user_id === user_id) {

        // TODO Delete files from CDN/Block Storage.

        // Delete the post (mediafiles data will cascade).
        await prisma.post.delete({
            where: {
                id: post_id
            }
        }).then(ctx => {
            return res.status(200).json({ "status": "Post deleted" });
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ "status": "Internal Sevre Error" });
        });
    }
}