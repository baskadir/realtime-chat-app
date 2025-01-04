const redisClient = require("../redis");
const { parseFriendList } = require("../helpers/parseFriendList");
const pool = require("../db/index");

const authorizeUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log("Bad request");
    next(new Error("Not authorized"));
  } else {
    next();
  }
};

const initializeUser = async (socket) => {
  socket.user = { ...socket.request.session.user };
  socket.join(socket.user.userid);
  await redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userid,
    "isConnected",
    true
  );

  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );

  const parsedFriendList = await parseFriendList(friendList, redisClient);
  const friendRooms = parsedFriendList.map((friend) => friend.userid);

  if (friendRooms.length > 0) {
    socket.to(friendRooms).emit("connected", true, socket.user.username);
  }

  socket.emit("get_friends", parsedFriendList);

  const msgQuery = await redisClient.lrange(
    `chat:${socket.user.userid}`,
    0,
    -1
  );

  // to.from.content
  const messages = msgQuery.map((msgStr) => {
    const parsedStr = msgStr.split(".");
    return { to: parsedStr[0], from: parsedStr[1], content: parsedStr[2] };
  });

  if (messages && messages.length > 0) socket.emit("get_messages", messages);
};

const addFriend = async (socket, friendName, callback) => {
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE username=$1",
    [friendName]
  );
  if (existingUser.rowCount === 0) {
    callback({ done: false, errorMessage: "User doesn't exist." });
    return;
  }

  if (friendName === socket.user.username) {
    callback({ done: false, errorMessage: "You cannot add yourself" });
    return;
  }

  const friend = await redisClient.hgetall(`userid:${friendName}`);
  if (!friend) {
    callback({ done: false, errorMessage: "User doesn't exist." });
    return;
  }

  const currentFriendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );

  if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
    callback({ done: false, errorMessage: "Friend already exist." });
    return;
  }

  await redisClient.lpush(
    `friends:${socket.user.username}`,
    [friendName, friend.userid].join(".")
  );

  const newFriend = {
    username: friendName,
    userid: friend.userid,
    isConnected: friend.isConnected,
  };
  callback({ done: true, newFriend });
};

const onDisconnect = async (socket) => {
  await redisClient.hset(
    `userid:${socket.user.username}`,
    "isConnected",
    false
  );

  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );

  const parsedFriendList = await parseFriendList(friendList, redisClient);
  const friendRooms = parsedFriendList.map((friend) => friend.userid);

  socket.to(friendRooms).emit("connected", false, socket.user.username);
};

const addMessage = async (socket, message) => {
  message.from = socket.user.userid;
  const messageString = [message.to, message.from, message.content].join(".");

  await redisClient.lpush(`chat:${message.to}`, messageString);
  await redisClient.lpush(`chat:${message.from}`, messageString);

  socket.to(message.to).emit("add_message", message);
};

module.exports = {
  authorizeUser,
  initializeUser,
  addFriend,
  onDisconnect,
  addMessage,
};
