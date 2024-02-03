const redisClient = require("../redis");
const { parseFriendList } = require("../helpers/parseFriendList");

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
};

const addFriend = async (socket, friendName, callback) => {
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
    callback({ done: false, errorMessage: "Firend already exist." });
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

module.exports = { authorizeUser, initializeUser, addFriend, onDisconnect };
