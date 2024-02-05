import { useContext, useEffect } from "react";
import socket from "../socket";
import { AccountContext } from "../context/AccountContext";

const useSocketSetup = (setFriendList, setMessages) => {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();

    socket.on("get_friends", (friendList) => {
      setFriendList(friendList);
    });

    socket.on("get_messages", (messages) => {
      setMessages(messages);
    });

    socket.on("add_message", (message) => {
      setMessages((prev) => [message, ...prev]);
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
      socket.off("connected");
      socket.off("get_friends");
      socket.off("get_messages");
      socket.off("add_message");
    };
  }, [setUser, setFriendList, setMessages]);
};

export default useSocketSetup;
