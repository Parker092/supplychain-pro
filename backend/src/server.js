import http from "http";
import { Server } from "socket.io";

import { app } from "./app.js";
import { env } from "./config/env.js";
import { initializeSocket } from "./realtime/socket.js";

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  path: "/socket.io"
});

initializeSocket(io);

httpServer.listen(env.port, "0.0.0.0", () => {
  console.log(`SupplyChain Pro backend running on port ${env.port}`);
  console.log(`SupplyChain Pro WebSocket server running on /socket.io`);
});