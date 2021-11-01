import { Poll } from "../db/schema";
import { PollModel } from "../db/mogoose";
import { rooms, io } from "../socket";

async function createPoll(poll: Poll) {
  try {
    /**
     * TODO: Add input validation
     * check course code string format
     */
    const result = await PollModel.create(poll);
    const pollId = result["_id"];

    return { pollId };
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

async function startPoll(pollId: string) {
  try {
    if (rooms[pollId]) return;
    rooms[pollId] = true;
    io.to(pollId).emit("pollStarted", true);
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

async function endPoll(pollId: string) {
  try {
    if (!rooms[pollId]) return;
    rooms[pollId] = false;
    io.to(pollId).emit("pollStarted", false);
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

export { createPoll, startPoll, endPoll };
