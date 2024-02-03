import { createContext, useState } from "react";
import useSocketSetup from "../hooks/useSocketSetup";

export const FriendContext = createContext();

const FriendProvider = ({ children }) => {
  const [friendList, setFriendList] = useState([]);

  useSocketSetup(setFriendList);

  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      {children}
    </FriendContext.Provider>
  );
};

export default FriendProvider;
