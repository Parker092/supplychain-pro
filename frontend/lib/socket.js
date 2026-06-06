import { io } from "socket.io-client";

export function createSocketClient() {
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";

  return io(socketUrl, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000
  });
}
