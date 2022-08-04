import { StudentModel } from "../db/mogoose";
import { io } from "../socket";
import { Socket } from "socket.io";
import { client } from "../redis";

async function join(socket: Socket, pollCode: string) {
  try {
    console.log(`join: ${socket.id}`);
    if (pollCode === null || pollCode === undefined)
      throw { code: 1, message: "Invalid poll code" };
    const pollId = await client.get(pollCode);
    console.log(pollId);
    if (pollId === null) throw { code: 1, message: "Invalid poll code" };

    // ensure that socket is connected to 1 room (other than the default room)
    socket.rooms.forEach((room) => {
      if (room !== socket.id) socket.leave(room);
    });

    const currSequence = await client.get(pollId);
    const hasStarted =
      currSequence == null ? false : parseInt(currSequence) > 0;
    console.log("Has Started", hasStarted);
    socket.join(pollId);
    socket.data["pollId"] = pollId;
    io.to(socket.id).emit("pollStarted", hasStarted);
  } catch (err) {
    console.log(err);
    io.to(socket.id).emit("error", err);
  }
}

async function pollResult(pollId: string, sequence: number) {
  try {
    const result = await StudentModel.aggregate([
      { $match: { pollId, sequence } },
      { $group: { _id: "$answer", count: { $sum: 1 } } },
    ]);
    console.log(result);
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
      throw { code: 1, message: "haven't joined any room" };
    const currSequence = await client.get(pollId);
    console.log(currSequence);
    if (currSequence === null || parseInt(currSequence) < 0) {
      throw { code: 2, message: "Poll not live yet" };
    }

    if (utorid === undefined || utorid === null)
      throw { code: 1, message: "Invalid utorid" };
    if (answer === undefined || answer === null)
      throw { code: 2, message: "Invalid answer" };

    await StudentModel.updateOne(
      {
        pollId,
        sequence: parseInt(currSequence),
      },
      {
        utorid,
        sequence: parseInt(currSequence),
        answer,
        timestamp: new Date(),
      },
      { upsert: true }
    );
    pollResult(pollId, parseInt(currSequence)).then((data) => {
      io.to(pollId).emit("result", data);
    });
    io.to(socket.id).emit("ack", answer);
    return;
  } catch (err) {
    console.log(err);
    io.to(socket.id).emit("error", err);
  }
}

export { vote, join, pollResult };
