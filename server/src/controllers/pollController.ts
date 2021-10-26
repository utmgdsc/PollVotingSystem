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
    rooms[pollId] = {
      currentQuestion: -1,
      totalQuestions: poll.questions.length,
    };
    return { pollId };
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

async function setPollStatus(
  pollId: string,
  running: boolean,
  questionId: number
) {
  if (questionId >= rooms[pollId].totalQuestions || questionId < 0)
    throw { message: "Invalid RoomId" };

  // poll is already in the required state so don't update db
  if (rooms[pollId].currentQuestion === questionId && running) return;
  else if (rooms[pollId].currentQuestion !== questionId && !running) return;

  // update the start time of question, update the end time of the question
  let field = running
    ? `questions.${questionId}.started`
    : `questions.${questionId}.ended`;
  const data: Record<string, Date> = {};
  data[field] = new Date();

  // update the end time of the current question if we are requesting a new question to start
  if (running && rooms[pollId].currentQuestion !== -1) {
    field = `questions.${rooms[pollId].currentQuestion}.ended`;
    data[field] = new Date();
  }
  await PollModel.updateOne({ _id: pollId }, { $set: data });

  /**
   * TODO: add room status to redis
   */
  if (running) rooms[pollId].currentQuestion = questionId;
  else rooms[pollId].currentQuestion = -1;

  return;
}

async function startPoll(pollId: string, questionId: number) {
  try {
    await setPollStatus(pollId, true, questionId);
    console.log(rooms);
    //notify client that there is a new question that has started
    io.emit("start", { pollId, questionId });
    return;
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

async function endPoll(pollId: string, questionId: number) {
  try {
    await setPollStatus(pollId, false, questionId);
    console.log(rooms);
    // notify clients connected to this poll that the poll has ended
    io.emit("end", { pollId, questionId });
    return;
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

async function changeQuestion(pollId: string, newQuestion: number) {
  if (newQuestion >= rooms[pollId].totalQuestions || newQuestion < 0)
    throw { message: "invalid question id" };

  await setPollStatus(pollId, true, newQuestion);
  console.log(rooms);
  io.emit("start", { pollId, questionId: rooms[pollId][0] });
  return { questionId: rooms[pollId].currentQuestion };
}

export { createPoll, startPoll, endPoll, changeQuestion };
