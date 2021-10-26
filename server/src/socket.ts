// socket setup
import { Server, Socket } from "socket.io";

// keep track of whether a room is open or closed instead of querying from dd
// if room is open, the value for that room id will be the current question else null
/**
 * TODO: shift to redis
 */
const rooms: Record<string, string | null> = {};

const io = new Server({
  cors: {
    origin: process.env.FRONTEND,
  },
});

// log the socket id when client socket connects for the first time
io.on("connection", (socket: Socket) => {
  console.log(`connect: ${socket.id}`);
});

export { io, rooms };
