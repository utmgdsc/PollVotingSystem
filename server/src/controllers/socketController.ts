import { Question, Poll } from "../db/schema";
import { PollResultsModel } from "../db/mogoose";
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
  io.to(socket.id).emit("start", {
    questionId: rooms[pollId].currentQuestion,
  });
}

async function vote(
  socket: Socket,
  questionId: number,
  option: number,
  studentId: string
) {
  try {
    console.log(`vote: ${socket.id}`);
    let pollId = "";
    console.log(socket.rooms);
    socket.rooms.forEach((room) => {
      console.log(room);
      if (room !== socket.id) pollId = room;
    });
    if (pollId === "") throw { message: "Not connected to room" };
    /**
     * TODO: Validate input
     */
    if (rooms[pollId].currentQuestion !== questionId)
      throw { message: "Question not live yet" };

    await PollResultsModel.updateOne(
      {
        pollId: pollId,
        questionId: questionId,
        "students.studentId": studentId,
      },
      {
        $set: {
          studentId,
          "student.$.option": option,
          timestamp: new Date(),
        },
      },
      { upsert: true }
    );
    return;
  } catch (err) {
    console.log(err);
    io.to(socket.id).emit("error", err);
  }
}

export { vote, join };
