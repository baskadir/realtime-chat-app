import { createContext, useState } from "react";

export const FriendContext = createContext();

const FriendProvider = ({ children }) => {
  const [friendList, setFriendList] = useState([]);

  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      {children}
    </FriendContext.Provider>
  );
};

export default FriendProvider;
