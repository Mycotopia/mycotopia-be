'use-strict'

import express from "express";
import csrfRoute from "./x-csrf/index.js";
import authRouter from "./auth/index.js";
import postsRouter from "./posts/index.js";
import userRouter from "./user/index.js";

// Root router.
const router = express.Router();

router.use("/x-csrf/", csrfRoute);
router.use("/auth/", authRouter);
router.use("/posts/", postsRouter);
router.use("/user/", userRouter);


export default router;