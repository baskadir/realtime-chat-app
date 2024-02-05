require("dotenv").config();

const express = require("express");
const http = require("http");
const helmet = require("helmet");
const { Server } = require("socket.io");
const cors = require("cors");
const authRouter = require("./router/authRouter");
const { sessionMiddleware, wrap } = require("./middlewares/sessionMiddleware");
const {
  authorizeUser,
  initializeUser,
  addFriend,
  onDisconnect,
  addMessage,
} = require("./controllers/socketController");

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
  initializeUser(socket);

  socket.on("add_friend", (friendName, callback) => {
    addFriend(socket, friendName, callback);
  });

  socket.on("add_message", message => addMessage(socket, message))

  socket.on("disconnecting", () => onDisconnect(socket));
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
