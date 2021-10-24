const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
const question = new Schema({
  question: String,
  id: ObjectId,
  options: [Number],
});
const poll = new Schema({
  name: String,
  description: String,
  pollId: ObjectId,
  courseCode: String,
  questions: [question],
  running: Boolean,
  created: Date,
});

const answer = new Schema({
  questionId: String,
  answers: [Number],
});
const student = new Schema({
  studentId: ObjectId,
  timestamp: Date,
  answers: [answer],
});

const pollResults = new Schema({
  pollId: String,
  students: [student],
});

export { poll, pollResults };
