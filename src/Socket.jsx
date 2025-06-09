import { io } from "socket.io-client";

// Connect to your backend WebSocket server
const socket = io("http://localhost:5000"); // adjust port as needed

export default socket;
