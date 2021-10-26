'use-strict'
import express from "express";
import { signUp, logIn, logOut } from "../../controllers/auth/index.js"

// Router for /auth/
const authRouter = express.Router();

// SignUp route.
authRouter.post("/signup/", (req, res) => {
    signUp(req, res);
});

// LogIn route.
authRouter.post("/login", (req, res) => {
    logIn(req, res);
});

// LogOut route.
authRouter.post("/logout/", (req, res) => {
    logOut(req, res);
});

export default authRouter;