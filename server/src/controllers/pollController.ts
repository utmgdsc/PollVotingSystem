import { Poll } from "../db/schema";
import { PollModel } from "../db/mogoose";
import { io } from "../socket";
import { client } from "../redis";
import { customAlphabet } from "nanoid/async";
import { pollResult } from "./socketController";
const nanoid = customAlphabet(
  "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890",
  6
);

// set poll code expiry to 1 day
const expiry = 60 * 60 * 24;

async function createPoll(poll: Poll) {
  if (!poll.hasOwnProperty("courseCode"))
    return { status: 400, data: { message: "courseCode is required" } };
  const promise = [nanoid(), PollModel.create(poll)] as const;
  const result = await Promise.all(promise);
  const pollId = result[1]["_id"].toString();
  const pollCode = result[0];
  await client.set(pollCode, pollId, { EX: expiry, NX: true });

  return { status: 201, data: { pollCode, pollId } };
}

async function changePollStatus(pollId: string, hasStarted: boolean) {
  if (typeof hasStarted !== "boolean")
    return {
      status: 400,
      data: { message: "hasStarted should be boolean" },
    };
  await client.set(pollId, hasStarted.toString(), {
    EX: expiry,
  });
  io.to(pollId).emit("pollStarted", hasStarted);
  return { status: 200, data: { message: "poll status successfully changed" } };
}

async function getStudents(courseCode: string, startTime: Date, endTime: Date) {
  try {
    let responseArray: {
      pollID: any;
      pollName: string;
      courseCode: string;
      utorid: string;
      answer: number;
      timestamp: Date;
    }[] = [];

    const result = await Promise.all([
      PollModel.find({ courseCode: courseCode }),
    ]);
    result[0].forEach((poll) => {
      poll.students.forEach((student) => {
        if (
          student.timestamp.getTime() >= startTime.getTime() &&
          student.timestamp.getTime() <= endTime.getTime()
        ) {
          const studentResponse = {
            pollID: poll._id.toString(),
            pollName: poll.name,
            courseCode: poll.courseCode,
            utorid: student.utorid,
            answer: student.answer,
            timestamp: student.timestamp,
          };
          responseArray.push(studentResponse);
        }
      });
    });
    return { responses: responseArray };
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

async function getPollStatus(pollId: any) {
  if (pollId === null || pollId === undefined || typeof pollId !== "string")
    return { status: 400, data: { message: "Invalid poll Id" } };
  const result = await client.get(pollId);
  const pollStarted = result === null ? false : true;
  return { status: 200, data: { pollStarted } };
}

async function getResult(pollId: any) {
  if (pollId === null || pollId === undefined || typeof pollId !== "string")
    return { status: 400, data: { message: "Invalid poll Id" } };
  const result = await pollResult(pollId);
  return { status: 200, data: { result } };
}

async function endForever(pollId: string) {
  if (pollId === null || pollId === undefined)
    return { status: 400, data: { message: "Invalid poll Id" } };
  await client.del(pollId);
  io.to(pollId).emit("close", { message: "Poll is over" });
  return { status: 200, data: { message: "Poll closed" } };
}

export {
  createPoll,
  changePollStatus,
  getStudents,
  getPollStatus,
  getResult,
  endForever,
};
