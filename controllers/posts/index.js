'use-strict'

const util = require("util");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const createPost = async (req, res) => {
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
                    await sharp(file.buffer).jpeg({ quality: 30 }).toFile('processed_images/' + file.originalname)
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


module.exports = { createPost };