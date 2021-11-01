import { model, connect, connection } from "mongoose";
import { PollDocument, pollSchema } from "./schema";

export const PollModel = model<PollDocument>("Poll", pollSchema);

connect(process.env.MONGODB_URL).catch((err) => {
  throw err;
});

export const db = connection;
