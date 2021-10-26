'use-strict'

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import csurf from "csurf";
import redis from "redis";
import connectRedis from "connect-redis";
import { createPost } from "./controllers/posts/index.js";
import router from "./routes/index.js";

const app = express();

//CSRF Protection
const csrfProtection = csurf();

// Redis Store
const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
    host: "localhost",
    port: 6379
});
redisClient.on('error', () => { console.log('Cannot connect to redis.') });
redisClient.on('connect', () => { console.log('Connected to redis.') });


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'process.env.SESSION_SECRET',
    name: "user_session",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true }
}));
app.use(csrfProtection);

// Routes

app.use("/", router);

app.get('/', (req, res) => {
    res.send(`Mycotopia Home Page. ${req.csrfToken()}`);
})


export default app;
