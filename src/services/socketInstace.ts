import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:4011"; // Change if your backend runs elsewhere

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, { withCredentials: true });
  }
  return socket;
}