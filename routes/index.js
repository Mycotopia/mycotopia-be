'use-strict'

import express from "express";
import authRouter from "./auth/index.js";

// Root router.
const router = express.Router();

router.use("/auth/", authRouter);


export default router;