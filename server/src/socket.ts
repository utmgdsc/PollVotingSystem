// socket setup
import { Server, Socket } from "socket.io";
import { vote } from "./controllers/questionController";

// keep track of whether a room is open or closed instead of querying from dd
// For each room key, the value is an array where the first element is the current question
// and the second element is the total number of question
// if first question is -1 then the poll is closed
/**
 * TODO: shift to redis
 */
const rooms: Record<string, Record<string, number>> = {};

const io = new Server({
  cors: {
    origin: process.env.FRONTEND,
  },
});

// log the socket id when client socket connects for the first time
io.on("connection", (socket: Socket) => {
  console.log(`connect: ${socket.id}`);
});

io.on("join", (socket: Socket, pollId: string) => {
  if (!(pollId in rooms)) {
    io.to(socket.id).emit("error", { message: "No such poll" });
    return;
  }

  // ensure that socket is connected to 1 room (other than the default room)
  for (let room in socket.rooms) {
    if (room !== socket.id) socket.leave(room);
  }
  socket.join(pollId);
  io.to(socket.id).emit("start", { questionId: rooms[pollId].currentQuestion });
});

io.on(
  "vote",
  async (
    socket: Socket,
    questionId: number,
    option: number,
    studentId: string
  ) => {
    let pollId = null;
    for (let room in socket.rooms) {
      if (room !== socket.id) pollId = room;
    }
    try {
      await vote(pollId, questionId, option, studentId);
    } catch (err) {
      io.to(socket.id).emit("error", { message: "Vote failed" });
    }
  }
);

export { io, rooms };
