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
    rooms[pollId] = [-1, poll.questions.length];
    return { pollId };
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

async function setPollStatus(pollId: string, running: boolean) {
  // poll is already in the required state so don't update db
  if (rooms[pollId][0] !== -1 && running) return;
  else if (rooms[pollId][0] === -1 && !running) return;

  const data: Record<string, Date> = {};
  if (running) data["started"] = new Date();
  else data["ended"] = new Date();

  await PollModel.updateOne({ _id: pollId }, { $set: { running, ...data } });

  /**
   * TODO: add room status to redis
   */
  if (running) rooms[pollId] = [0, rooms[pollId][1]];
  // set to first question
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
    io.emit("end", { pollId });
    return;
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

async function changeQuestion(pollId: string, newQuestion: number) {
  if (rooms[pollId][0] === -1) throw { message: "quiz hasn't started" };
  if (newQuestion >= rooms[pollId][1])
    throw { message: "all questions covered" };
  if (newQuestion < 0) throw { message: "can't go back" };
  rooms[pollId][0] = newQuestion;
  io.emit("question", { pollId, currentQuestion: rooms[pollId][0] });
  return { currentQuestion: rooms[pollId][0] };
}

export { createPoll, startPoll, endPoll, changeQuestion };
