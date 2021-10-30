'use-strict'

import express from "express";
import { getUserProfile, getUserFollowing, getUserFollowers } from "../../controllers/user/index.js";

const userRouter = express.Router();

// Get user ptofile data.
userRouter.get("/get/:user_name/", (req, res) => {
    getUserProfile(req, res);
});

// Get a user's following.
userRouter.get("/get/:user_name/following/", (req, res) => {
    getUserFollowing(req, res);
});

// Get a user's followers.
userRouter.get("/get/:user_name/followers", (req, res) => {
    getUserFollowers(req, res);
});


export default userRouter;