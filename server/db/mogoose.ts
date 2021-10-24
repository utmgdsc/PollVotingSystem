const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
mongoose.connect(process.env.DB_URL);

const { poll, pollResults } = require("./schema");

const PollResults = mongoose.model("PollResults", pollResults);
const Poll = mongoose.model("Poll", poll);

export { mongoose, Poll, PollResults };
