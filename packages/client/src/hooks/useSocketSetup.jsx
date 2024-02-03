import { useContext, useEffect } from "react";
import socket from "../socket";
import { AccountContext } from "../context/AccountContext";

const useSocketSetup = (setFriendList) => {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();

    socket.on("get_friends", (friendList) => {
      setFriendList(friendList);
    });

    socket.on("connected", (status, username) => {
      setFriendList((prev) => {
        return [...prev].map((friend) => {
          if (friend.username === username) {
            friend.isConnected = status;
          }
          return friend;
        });
      });
    });

    socket.on("connect_error", () => {
      setUser({ loggedIn: false });
    });

    return () => {
      socket.off("connect_error");
    };
  }, [setUser, setFriendList]);
};

export default useSocketSetup;
