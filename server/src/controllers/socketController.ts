import { PollModel } from "../db/mogoose";
import { io } from "../socket";
import { Socket } from "socket.io";
import { client } from "../redis";

async function join(socket: Socket, pollId: string) {
  try {
    console.log(`join: ${socket.id}`);
    const hasStarted = await client.get(pollId);
    console.log(hasStarted);
    if (hasStarted.localeCompare(true.toString()) !== 0) {
      throw { message: "No such poll" };
    }

    // ensure that socket is connected to 1 room (other than the default room)
    socket.rooms.forEach((room) => {
      if (room !== socket.id) socket.leave(room);
    });

    socket.join(pollId);
    io.to(socket.id).emit("pollStarted", hasStarted);
  } catch (err) {
    console.log(err);
    io.to(socket.id).emit("error", err);
  }
}

async function vote(socket: Socket, answer: number, utorid: string) {
  try {
    console.log(`vote: ${socket.id}`);
    let pollId = socket.data.pollId;
    /**
     * TODO: Validate input
     */
    const hasStarted = await client.get(pollId);
    console.log(hasStarted);
    if (hasStarted.localeCompare(true.toString()) !== 0) {
      throw { message: "Question not live yet" };
    }

    await PollModel.updateOne(
      {
        _id: pollId,
      },
      {
        $addToSet: {
          students: {
            utorid,
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
