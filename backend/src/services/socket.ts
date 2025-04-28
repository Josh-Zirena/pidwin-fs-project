import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { EventEmitter } from "events";

export const rollEmitter = new EventEmitter();
export const connectedSockets = new Set<string>();

export function initSocketServer(httpServer: http.Server) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    connectedSockets.add(socket.id);
    console.log("client connected:", socket.id);

    const emitRoll = () => {
      const d1 = Math.ceil(Math.random() * 6);
      const d2 = Math.ceil(Math.random() * 6);
      socket.emit("roll", { d1, d2 });

      rollEmitter.emit(`roll:${socket.id}`, { d1, d2 });
    };

    let intervalId: NodeJS.Timeout;

    socket.on("ready", () => {
      emitRoll();
      // NOTE: This should really be 15000, but I prefer faster gameplay.
      intervalId = setInterval(emitRoll, 5000);
    });

    socket.on("disconnect", () => {
      clearInterval(intervalId);
      console.log("client disconnected:", socket.id);
    });
  });

  return io;
}
