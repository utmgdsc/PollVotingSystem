import { Schema, Document, Types } from "mongoose";

/**
 * student subdocument. Used as nested objects in PollResults schema
 * utorid: unique student id to identify the the student possibly the student utorid
 * answers: array of answer subdocument
 */
export interface Student {
  utorid: string;
  answer: number;
  timestamp: Date;
  sequence: number;
}

const student = new Schema<Student>(
  {
    utorid: {
      type: String,
      required: true,
    },
    answer: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
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
  name?: string;
  description?: string;
  courseCode: string;
  created: Date;
  options?: number;
  students?: Student[];
}

export interface PollDocument extends Poll, Document {}

export const pollSchema = new Schema<PollDocument>({
  name: String,
  description: String,
  courseCode: { type: String, required: true },
  created: { type: Date, required: true },
  options: Number,
  students: [student],
});

export const ObjectId = Types.ObjectId;
