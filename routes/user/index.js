'use-strict'

import express from "express";
import { getUserProfile } from "../../controllers/user/index.js";

const userRouter = express.Router();

userRouter.get("/get/:user_name", (req, res) => {
    getUserProfile(req, res);
});


export default userRouter;