import { createContext, useState } from "react";
import useSocketSetup from "../hooks/useSocketSetup";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [friendList, setFriendList] = useState([]);
  const [messages, setMessages] = useState([]);

  useSocketSetup(setFriendList, setMessages);

  return (
    <ChatContext.Provider
      value={{ friendList, setFriendList, messages, setMessages }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
