import { Router } from "express";
import { createPoll, endPoll, startPoll } from "../controllers/pollController";

const pollRouter = Router();

pollRouter.post("/", async (req, res) => {
  const { name, description, courseCode, options } = req.body;
  try {
    const poll = {
      name,
      description,
      courseCode,
      options,
      created: new Date(),
    };
    const result = await createPoll(poll);
    return res.status(201).send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Poll creation failed" });
  }
});

pollRouter.patch("/:pollId/start", async (req, res) => {
  const { pollId } = req.params;
  try {
    await startPoll(pollId);
    return res.send({ message: "Poll successfully started" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Poll failed to start" });
  }
});

pollRouter.patch("/:pollId/end", async (req, res) => {
  const { pollId } = req.params;
  try {
    await endPoll(pollId);
    return res.send({ message: "Poll successfully ended" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Poll failed to end" });
  }
});

export default pollRouter;
