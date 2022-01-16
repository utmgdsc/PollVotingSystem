// socket setup

import { Server, Socket } from "socket.io";
import { vote, join } from "./controllers/socketController";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 points connections
  duration: 3, // per second
});

const io = new Server({
  path: "/socket.io",
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

// log the socket id when client socket connects for the first time
io.on("connection", (socket: Socket) => {
  console.log(`connect: ${socket.id}`);

  // let the socket join rooms once connected
  socket.on("join", async (pollCode: string) => {
    try {
      await rateLimiter.consume(socket.data.utorid);
      await join(socket, pollCode);

      // let the socket vote in the connected room
      socket.on("vote", async (answer: number) => {
        try {
          await rateLimiter.consume(socket.data.utorid);
          await vote(socket, answer, socket.data.utorid);
        } catch (err) {
          socket.emit("error", { code: 2, message: "retry again later" });
        }
      });
    } catch (err) {
      socket.emit("error", { code: 2, message: "retry again later" });
    }
  });
});

export { io };
