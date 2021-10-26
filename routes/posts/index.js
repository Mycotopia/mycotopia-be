'use-strict'

import express from "express";
import { createPost } from "../../controllers/posts/index.js";

const postsRouter = express.Router();

postsRouter.post("/create", (req, res) => {
    createPost(req, res);
});

export default postsRouter;