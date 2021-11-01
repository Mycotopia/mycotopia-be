'use-strict'
import express from "express";
import verifyReCaptcha from "../../middlewares/reCaptcha/index.js";
import { signUp, logIn, logOut } from "../../controllers/auth/index.js"

// Router for /auth/
const authRouter = express.Router();

// SignUp route.
authRouter.post("/signup/", verifyReCaptcha, (req, res) => {
    signUp(req, res);
});

// LogIn route.
authRouter.post("/login", verifyReCaptcha, (req, res) => {
    logIn(req, res);
});

// LogOut route.
authRouter.post("/logout/", (req, res) => {
    logOut(req, res);
});

export default authRouter;