import { PollModel } from "../db/mogoose";
import { io } from "../socket";
import { Socket } from "socket.io";
import { client } from "../redis";
import { ObjectId } from "../db/schema";

async function join(socket: Socket, pollCode: string) {
  try {
    console.log(`join: ${socket.id}`);
    const pollId = await client.get(pollCode);
    console.log(pollId);
    if (pollId === null) {
      throw { message: "No such poll" };
    }

    // ensure that socket is connected to 1 room (other than the default room)
    socket.rooms.forEach((room) => {
      if (room !== socket.id) socket.leave(room);
    });
    const hasStarted = await client.get(pollId);
    console.log(hasStarted);
    socket.join(pollId);
    socket.data["pollId"] = pollId;
    io.to(socket.id).emit("pollStarted", hasStarted);
  } catch (err) {
    console.log(err);
    io.to(socket.id).emit("error", err);
  }
}

async function result(pollId: string) {
  try {
    const result = await PollModel.aggregate([
      { $match: { _id: new ObjectId(pollId) } },
      { $unwind: "$students" },
      { $group: { _id: "$students.answer", count: { $sum: 1 } } },
    ]);
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function vote(socket: Socket, answer: number, utorid: string) {
  try {
    console.log(`vote: ${socket.id}`);
    let pollId = socket.data.pollId;
    if (pollId === null || pollId === undefined)
      throw { message: "haven't joined any room" };
    /**
     * TODO: Validate input
     */
    const hasStarted = await client.get(pollId);
    console.log(hasStarted);
    if (
      hasStarted === null ||
      hasStarted === undefined ||
      hasStarted.localeCompare(true.toString()) !== 0
    ) {
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
    result(pollId).then((data) => {
      io.to(pollId).emit("result", data);
    });
    return;
  } catch (err) {
    console.log(err);
    io.to(socket.id).emit("error", err);
  }
}

export { vote, join };
