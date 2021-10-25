import { Question, Poll } from "../db/schema";
import { PollModel } from "../db/mogoose";
import { rooms } from "../socket";

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
    throw err;
  }
}

async function startPoll(pollId: string) {
  try {
    /**
     * TODO: Validate input
     * Check whether the user starting the poll was the one who created the poll
     */
    // poll has already started so no need to make db update
    if (rooms[pollId]) return;

    await PollModel.updateOne(
      { _id: pollId },
      { $set: { running: true, started: new Date() } }
    );
    /**
     * TODO: add room status to redis
     */
    rooms[pollId] = true;
    return;
  } catch (err) {
    throw err;
  }
}

export { createPoll, startPoll };
