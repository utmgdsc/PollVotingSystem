import { Question, Poll } from "../db/schema";
import { PollModel } from "../db/mogoose";

async function createPoll(poll: Poll) {
  try {
    /**
     * TODO: Add input validation
     */
    const result = await PollModel.create(poll);
    const pollId = result["_id"];
    return { pollId };
  } catch (err) {
    throw err;
  }
}

export { createPoll };
