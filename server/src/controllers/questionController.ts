import { Question, Poll } from "../db/schema";
import { PollResultsModel } from "../db/mogoose";
import { rooms, io } from "../socket";

async function vote(
  pollId: string,
  questionId: number,
  option: number,
  studentId: string
) {
  try {
    /**
     * TODO: Validate input
     */
    if (rooms[pollId].currentQuestion !== questionId)
      throw { message: "Question not live yet" };

    await PollResultsModel.updateOne(
      {
        pollId: pollId,
        questionId: questionId,
        "students.studentId": studentId,
      },
      {
        $addToSet: {
          students: {
            studentId: studentId,
            option: option,
            timestamp: new Date(),
          },
        },
        $set: {
          "student.$.option": option,
          timestamp: new Date(),
        },
      },
      { upsert: true }
    );
    return;
  } catch (err) {
    throw err;
  }
}

export { vote };
