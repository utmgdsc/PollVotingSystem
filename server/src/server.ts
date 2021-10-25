"use strict";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import io from "./socket";

// starting the express server
const app = express();
const port = process.env.PORT || 5000;

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("useFindAndModify", false);

// parse cookies and body and enable cors
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const server = app.listen(port, () => {
  console.log("Listening on http://localhost:" + port);
  io.attach(server);
});
