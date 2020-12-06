const express = require("express");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const helmet = require("helmet");
const cors = require("cors");

const userRouter = require("../users/user-router.js");
const authRouter = require("../auth/auth-router.js");
const Knex = require("knex");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

const sessionConfig = {
  name: "alsession",
  secret: "keep it al",
  cookie: {
    maxAge: 3600 * 1000,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,

  store: new KnexSessionStore({
    knex: require("../data/connection.js"),
    tableName: "sessions",
    sidFieldName: "sid",
    createTabl: true,
    clearInterval: 3600 * 1000,
  }),
};

server.use(session(sessionConfig));
server.use("/api/users", userRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up auth1 project" });
});

module.exports = server;
