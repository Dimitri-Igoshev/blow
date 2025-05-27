import { io } from "socket.io-client";

const socket = io("wss://blow.ru", {
  path: "/socket.io/",
  transports: ["websocket"],
});

export default socket;
