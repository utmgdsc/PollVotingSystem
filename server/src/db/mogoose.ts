import { model, connect, connection } from "mongoose";
import {
  PollDocument,
  pollSchema,
  resultSchema,
  ResultDocument,
} from "./schema";

export const PollModel = model<PollDocument>("Poll", pollSchema);
export const PollResultsModel = model<ResultDocument>(
  "PollResults",
  resultSchema
);

connect(process.env.MONGODB_URL).catch((err) => {
  throw err;
});

export const db = connection;
