import { Poll } from "../db/schema";
import { PollModel } from "../db/mogoose";
import { io } from "../socket";
import { client } from "../redis";
import { customAlphabet } from "nanoid/async";
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

export { createPoll, changePollStatus };
