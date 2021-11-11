"use strict";

import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { io } from "./socket";
import pollRouter from "./routes/pollRoute";
import { db } from "./db/mogoose";
db.on("open", () => {
  console.log("Connected to mongo");
});

// starting the express server
const app = express();
const port = process.env.PORT || 5000;

// parse cookies and body and enable cors
app.use(cors({ origin: "http://localhost:5000", credentials: true, methods: "GET,POST,DELETE,PATCH"}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/poll", pollRouter);

const server = app.listen(port, () => {
  console.log("Listening on http://localhost:" + port);
  io.attach(server);
});
