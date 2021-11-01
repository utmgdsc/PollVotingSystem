// socket setup
import { Server, Socket } from "socket.io";
import { vote, join } from "./controllers/socketController";

const io = new Server({
  // cors: {
  //   origin: process.env.FRONTEND,
  // },
});

// log the socket id when client socket connects for the first time
io.on("connection", (socket: Socket) => {
  console.log(`connect: ${socket.id}`);

  // let the socket join rooms once connected
  socket.on("join", async (pollId: string) => {
    await join(socket, pollId);
    socket.data["pollId"] = pollId;
    // let the socket vote in the connected room
    socket.on("vote", async (answer: number, utorid: string) => {
      await vote(socket, answer, utorid);
    });
  });
});

export { io };
