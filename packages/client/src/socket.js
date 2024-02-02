import { io } from "socket.io-client";

const socket = new io("http://localhost:3200", {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
