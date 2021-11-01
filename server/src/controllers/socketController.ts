import { PollModel } from "../db/mogoose";
import { rooms, io } from "../socket";
import { Socket } from "socket.io";

function join(socket: Socket, pollId: string) {
  console.log(`join: ${socket.id}`);
  if (!(pollId in rooms)) {
    io.to(socket.id).emit("error", { message: "No such poll" });
    return;
  }

  // ensure that socket is connected to 1 room (other than the default room)
  socket.rooms.forEach((room) => {
    if (room !== socket.id) socket.leave(room);
  });

  socket.join(pollId);
  io.to(socket.id).emit("pollStarted", Boolean(rooms[pollId]));
}

async function vote(socket: Socket, answer: number, studentId: string) {
  try {
    console.log(`vote: ${socket.id}`);
    let pollId = socket.data.pollId;
    /**
     * TODO: Validate input
     */
    if (!rooms[pollId]) throw { message: "Question not live yet" };

    await PollModel.updateOne(
      {
        _id: pollId,
      },
      {
        $addToSet: {
          students: {
            studentId,
            answer,
            timestamp: new Date(),
          },
        },
      }
    );
    return;
  } catch (err) {
    console.log(err);
    io.to(socket.id).emit("error", err);
  }
}

export { vote, join };
