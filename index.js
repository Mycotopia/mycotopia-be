require('dotenv').config();
const express = require('express');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const csurf = require("csurf");
const redis = require("redis");
const connectRedis = require("connect-redis");
const { signUp } = require("./controllers/signUp");
const { logIn } = require("./controllers/logIn");
const { logOut } = require("./controllers/logOut");

const app = express();

//CSRF Protection
const csrfProtection = csurf();

// Redis Store
const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
    host: "localhost",
    port: 6379
});

redisClient.on('error', () => { console.log('error') });
redisClient.on('connect', () => { console.log('connected') });


// Middlewares
app.use(express.json());
app.use(cookieParser())
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'process.env.SESSION_SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true }
}));
app.use(csrfProtection);

app.get('/', (req, res) => {
    res.send(`Mycotopia Home Page. ${req.csrfToken()}`);
})

app.post("/signup/", (req, res) => {
    signUp(req, res);
})

app.post("/login/", (req, res) => {
    logIn(req, res);
})

app.post("/logout/", (req, res) => {
    logOut(req, res);
})

app.listen(process.env.PORT || 3001, () => {
    console.info(`Server running on  http://localhost:${process.env.PORT || 3001}`)
})