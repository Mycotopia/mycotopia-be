require('dotenv').config();
const express = require('express');
const { signUp } = require("./controllers/signUp");

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Mycotopia Home Page.");
})

app.post("/signup/", (req, res) => {
    signUp(req, res);
})

app.listen(process.env.PORT || 3001, () => {
    console.info(`Server running on  http://localhost:${process.env.PORT || 3001}`)
})