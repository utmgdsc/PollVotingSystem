// socket setup
import { Server, Socket } from "socket.io";
const io = new Server({
  cors: {
    origin: process.env.FRONTEND,
  },
});

// log the socket id when client socket connects for the first time
io.on("connection", (socket: Socket) => {
  console.log(`connect: ${socket.id}`);
});

export default io;
