'use-strict'

import express from "express";

const csrfRoute = express.Router();

csrfRoute.get("/", (req, res) => {
    res.status(200).json({ "_csrf": req.csrfToken() })
});


export default csrfRoute;