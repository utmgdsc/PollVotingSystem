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
    rooms[pollId] = null;
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
  // poll is already in the required state so don't update db
  if (rooms[pollId] !== null && running) return;
  else if (rooms[pollId] === null && !running) return;

  const data: Record<string, Date> = {};
  if (running) data["started"] = new Date();
  else data["ended"] = new Date();

  const result = await PollModel.findOneAndUpdate(
    { _id: pollId },
    { $set: { running, ...data } }
  );
  console.log(result);
  /**
   * TODO: add room status to redis
   */
  if (running) rooms[pollId] = result.questions[0]["_id"];
  else rooms[pollId] = null;

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
