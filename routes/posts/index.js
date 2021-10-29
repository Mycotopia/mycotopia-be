'use-strict'

import express from "express";
import { createPost, deletePost } from "../../controllers/posts/index.js";

const postsRouter = express.Router();

postsRouter.post("/create", (req, res) => {
    createPost(req, res);
});

postsRouter.delete("/:post_id", (req, res) => {
    deletePost(req, res);
});

export default postsRouter;