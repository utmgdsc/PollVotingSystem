"use strict";

import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { io } from "./socket";
import pollRouter from "./routes/pollRoute";
import { db } from "./db/mogoose";
import userRouter from "./routes/userRoutes";
db.on("open", () => {
  console.log("Connected to mongo");
});

// starting the express server
const app = express();
const port = process.env.PORT || 5000;

// parse cookies and body and enable cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET,POST,DELETE,PATCH",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.headers.utorid != undefined) {
    next();
    return;
  }
  next(new Error("Not authenticated"));
});
app.use("/poll", pollRouter);
app.use("/user", userRouter);

const server = app.listen(port, () => {
  console.log("Listening on http://localhost:" + port);
  io.attach(server);
  io.use((socket, next) => {
    if (socket.handshake.headers.utorid != undefined) {
      socket.data["utorid"] = socket.handshake.headers.utorid;
      next();
      return;
    } else if (socket.data.utorid != undefined) {
      next();
      return;
    }
    next(new Error("Not Authorized"));
  });
});
