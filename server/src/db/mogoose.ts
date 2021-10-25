import { model, connect, connection } from "mongoose";
import {
  PollDocument,
  pollSchema,
  PollResultsDocument,
  pollResultsSchema,
} from "./schema";

export const PollModel = model<PollDocument>("Poll", pollSchema);
export const PollResultsModel = model<PollResultsDocument>(
  "PollResults",
  pollResultsSchema
);

connect(process.env.MONGODB_URL).catch((err) => {
  throw err;
});

export const db = connection;
