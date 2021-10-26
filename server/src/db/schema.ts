import { Schema, Types, Document } from "mongoose";

/**
 * A question subdocument. Used as nested objects in Poll schema
 * question: The question that will be displayed to students
 * options: Number of options
 */
export interface Question {
  question?: string;
  options: number;
  started?: Date;
  ended?: Date;
}

const question = new Schema<Question>(
  {
    question: String,
    options: {
      type: Number,
      required: true,
    },
    started: Date,
    ended: Date,
  },
  { _id: false }
);

/**
 * Poll schema. Represents how a single poll will look like
 * name: name of the poll
 * description: short description of the poll
 * pollId: unique poll id used to generate url
 * courseCode: course code for which this poll is being used for
 * questions: Array of questions for this poll
 * running: whether this poll is still running or not
 * created: when was this quiz created
 * ended: when did this quiz end
 */
export interface Poll {
  name: string;
  description?: string;
  courseCode: string;
  questions: Question[];
  created: Date;
}

export interface PollDocument extends Poll, Document {}

export const pollSchema = new Schema<PollDocument>({
  name: { type: String, required: true },
  description: String,
  courseCode: { type: String, required: true },
  questions: { type: [question], required: true },
  created: { type: Date, required: true },
});

/**
 * answer subdocument. Used as nested objects in student subdocument
 * questionId: unique question id to correspond the student answers to a question
 * answers: the choosen option for the given question id
 * timestamp: when was was the question answered
 */
export interface Answer {
  questionId: number;
  answer: number[];
  timestamp: Date;
}
const answer = new Schema<Answer>(
  {
    questionId: {
      type: Number,
      required: true,
    },
    answer: {
      type: [Number],
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

/**
 * student subdocument. Used as nested objects in PollResults schema
 * studentId: unique student id to identify the the student possibly the student number
 * answers: array of answer subdocument
 */
export interface Student {
  studentId: string;
  answers: Answer[];
}

const student = new Schema<Student>(
  {
    studentId: {
      type: String,
      required: true,
    },
    answers: {
      type: [answer],
      required: true,
    },
  },
  { _id: false }
);

/**
 * Poll Results schema. Represents the outcome of a poll
 * pollId: Corresponds to a Poll document
 * students: Array of student objects who participated
 */
export interface PollResults {
  pollId: Types.ObjectId;
  students: Student[];
}

export interface PollResultsDocument extends PollResults, Document {}
export const pollResultsSchema = new Schema<PollResultsDocument>({
  pollId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  students: {
    type: [student],
    required: true,
  },
});
