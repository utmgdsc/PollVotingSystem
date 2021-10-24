"use strict";
const log = console.log();
// read the environment variable (will be 'production' in production mode)

const env = process.env.NODE_ENV;

const express = require("express");

// starting the express server
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");

const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("useFindAndModify", false);

// enable CORS if in development, for React local development server to connect to the web server.
// if (env !== 'production') { app.use(cors()) }

// body-parser: middleware for parsing HTTP JSON body into a usable object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// function isMongoError(error) { // checks for first error returned by promise rejection if Mongo database suddently disconnects
//     return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
// }

// // middleware for mongo connection error for routes that need it
const mongoChecker = (req, res, next) => {
  // check mongoose connection established.
  if (mongoose.connection.readyState != 1) {
    // log('Issue with mongoose connection')
    res.status(500).send("Internal server error");
    return;
  } else {
    next();
  }
};
