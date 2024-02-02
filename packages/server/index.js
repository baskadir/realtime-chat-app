require("dotenv").config();

const express = require("express");
const http = require("http");
const helmet = require("helmet");
const { Server } = require("socket.io");
const cors = require("cors");
const authRouter = require("./router/authRouter");
const { sessionMiddleware, wrap } = require("./middlewares/sessionMiddleware");
const {
  authorizeUserMiddleware,
} = require("./middlewares/authorizeUserMiddleware");

const PORT = 3200;
const corsConfig = {
  origin: "http://localhost:3000",
  credentials: true,
};

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: corsConfig,
});

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(sessionMiddleware);

app.use("/api/auth", authRouter);

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
io.on("connect", (socket) => {
  console.log(socket.id);
  console.log(socket.request.session.user.username);
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
