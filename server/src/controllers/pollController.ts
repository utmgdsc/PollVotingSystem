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

async function changePollStatus(pollId: string, hasStarted: boolean) {
  try {
    if (rooms[pollId] === hasStarted) return;
    rooms[pollId] = hasStarted;
    console.log(rooms);
    io.to(pollId).emit("pollStarted", hasStarted);
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

export { createPoll, changePollStatus };
