import { Router } from "express";
import {
  changePollStatus,
  createPoll,
  getPollStatus,
  getResult,
  getStudents,
  endForever,
} from "../controllers/pollController";

const pollRouter = Router();

pollRouter.post("/", async (req, res) => {
  const { name, description, courseCode, options } = req.body;
  try {
    const poll = {
      name,
      description,
      courseCode: courseCode.toUpperCase(),
      options,
      created: new Date(),
    };
    const result = await createPoll(poll);
    return res.status(result.status).send(result.data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

pollRouter.patch("/:pollId", async (req, res) => {
  const { pollId } = req.params;
  const { hasStarted } = req.body;
  try {
    const result = await changePollStatus(pollId, hasStarted);
    return res.status(result.status).send(result.data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

pollRouter.get("/students", async (req, res) => {
  const courseCode = req.query.courseCode as string;
  const startTime = req.query.startTime as string;
  const endTime = req.query.endTime as string;
  //const { startTime, endTime } = req.body;
  console.log(req.query);
  console.log(startTime, endTime);
  try {
    const result = await getStudents(
      courseCode.toUpperCase(),
      new Date(startTime),
      new Date(endTime)
    );
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({ message: "Failed to find students" });
  }
});

pollRouter.get("/status", async (req, res) => {
  const { pollId } = req.query;
  try {
    if (typeof req.headers.utorid !== "string") {
      return res.status(400).send({ message: "Invalid utorid" });
    }
    const result = await getPollStatus(pollId as string);
    return res.status(result.status).send(result.data);
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

pollRouter.get("/result", async (req, res) => {
  const { pollId } = req.query;
  try {
    if (typeof req.headers.utorid !== "string") {
      return res.status(400).send({ message: "Invalid utorid" });
    }
    const result = await getResult(pollId as string);
    return res.status(result.status).send(result.data);
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

pollRouter.patch("/end/:pollCode", async (req, res) => {
  const { pollCode } = req.params;
  try {
    const result = await endForever(pollCode);
    return res.status(result.status).send(result.data);
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

export default pollRouter;
