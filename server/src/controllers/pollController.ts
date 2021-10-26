import { Question, Poll } from "../db/schema";
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

    /**
     * TODO: add room status to redis
     */
    rooms[pollId] = false;
    return { pollId };
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

async function setPollStatus(pollId: string, running: boolean) {
  /**
   * TODO: Validate input
   * Check whether the user starting the poll was the one who created the poll
   */
  // poll has already started so no need to make db update
  if (rooms[pollId] === running) return;
  const data: Record<string, Date> = {};
  if (running) data["started"] = new Date();
  else data["ended"] = new Date();

  await PollModel.updateOne({ _id: pollId }, { $set: { running, ...data } });
  /**
   * TODO: add room status to redis
   */
  rooms[pollId] = running;
  return;
}

async function startPoll(pollId: string) {
  try {
    await setPollStatus(pollId, true);
    return;
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

async function endPoll(pollId: string) {
  try {
    await setPollStatus(pollId, false);

    // notify clients connected to this poll that the poll has ended
    io.emit("end", { pollId: pollId });
    return;
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

export { createPoll, startPoll, endPoll };
