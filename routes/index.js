'use-strict'

import express from "express";
import csrfRoute from "./x-csrf/index.js";
import authRouter from "./auth/index.js";
import postsRouter from "./posts/index.js";

// Root router.
const router = express.Router();

router.use("/x-csrf/", csrfRoute);
router.use("/auth/", authRouter);
router.use("/posts/", postsRouter);


export default router;