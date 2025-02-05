require("dotenv").config();

const session = require("express-session");
const redisClient = require("../redis");
const RedisStore = require("connect-redis").default;

const redisStore = new RedisStore({
  client: redisClient,
});

const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET,
  credentials: true,
  name: "sid",
  store: redisStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production" ? "true" : "auto",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: 1000 * 60 * 60 * 24 * 7,
  },
});

const wrap = (expressMiddleware) => (socket, next) =>
  expressMiddleware(socket.request, {}, next);

module.exports = { sessionMiddleware, wrap };
