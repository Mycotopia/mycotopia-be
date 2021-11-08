'use-strict'

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import csurf from "csurf";
import helmet from "helmet";
import cors from "cors";
import redisClient from "./services/redisClient.js";
import connectRedis from "connect-redis";
import router from "./routes/index.js";

const app = express();

//CSRF Protection
const csrfProtection = csurf();

// Redis Store
const RedisStore = connectRedis(session);
redisClient.on('error', () => { console.log('Cannot connect to redis.') });
redisClient.on('connect', () => { console.log('Connected to redis.') });

// CORS Config
const cors_config = {
    origin: "http://localhost:3000",
    credentials: true
}

// Middlewares
app.use(helmet());
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
app.use(cors(cors_config));

// Routes

app.use("/", router);

app.get('/', (req, res) => {
    res.send(`Mycotopia Home Page. ${req.csrfToken()}`);
})


export default app;
