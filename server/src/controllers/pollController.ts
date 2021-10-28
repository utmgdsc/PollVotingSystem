import { Poll } from "../db/schema";
import { PollModel, PollResultsModel } from "../db/mogoose";
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

async function startPoll(pollId: string, questionId: number) {
  const { currentQuestion, totalQuestions } = rooms[pollId];
  try {
    if (questionId >= totalQuestions || questionId < 0)
      throw { message: "Invalid RoomId" };

    if (currentQuestion === questionId) return;

    let promises = [
      PollResultsModel.updateOne(
        { pollId, questionId },
        { $set: { started: new Date(), pollId, questionId } },
        { upsert: true }
      ),
    ];

    // end the current question
    if (currentQuestion !== -1) {
      promises.push(
        PollResultsModel.updateOne(
          { pollId, questionId: currentQuestion },
          { $set: { ended: new Date() } }
        )
      );
    }
    await Promise.all(promises);
    rooms[pollId].currentQuestion = questionId;
    console.log(rooms);
    //notify client that there is a new question that has started
    io.to(pollId).emit("start", { questionId });
    return;
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

async function endPoll(pollId: string, questionId: number) {
  const { currentQuestion, totalQuestions } = rooms[pollId];
  try {
    if (questionId >= totalQuestions || questionId < 0)
      throw { message: "Invalid question id" };

    if (currentQuestion === -1) return;
    await PollResultsModel.updateOne(
      { pollId, questionId },
      { $set: { ended: new Date() } }
    );
    rooms[pollId].currentQuestion = -1;
    console.log(rooms);
    // notify clients connected to this poll that the poll has ended
    io.to(pollId).emit("end", { questionId });
    return;
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

export { createPoll, startPoll, endPoll };
