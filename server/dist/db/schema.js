"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollResultsSchema = exports.pollSchema = void 0;
const mongoose_1 = require("mongoose");
const question = new mongoose_1.Schema({
    question: String,
    options: {
        type: [Number],
        required: true,
    },
});
exports.pollSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: String,
    courseCode: { type: String, required: true },
    questions: { type: [question], required: true },
    running: { type: Boolean, required: true },
    created: { type: Date, required: true },
    ended: { type: Date, required: true },
});
const answer = new mongoose_1.Schema({
    questionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    answers: {
        type: [Number],
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
});
const student = new mongoose_1.Schema({
    studentId: {
        type: String,
        required: true,
    },
    answers: {
        type: [answer],
        required: true,
    },
});
exports.pollResultsSchema = new mongoose_1.Schema({
    pollId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    students: {
        type: [student],
        required: true,
    },
});
//# sourceMappingURL=schema.js.map