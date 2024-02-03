module.exports.parseFriendList = async (friendList, redisClient) => {
  const newFriendList = [];
  for (const friend of friendList) {
    const parsedFriend = friend.split(".");
    const friendConnectedStatus = await redisClient.hget(
      `userid:${parsedFriend[0]}`,
      "isConnected"
    );
    newFriendList.push({
      username: parsedFriend[0],
      userid: parsedFriend[1],
      isConnected: friendConnectedStatus,
    });
  }

  return newFriendList;
};
