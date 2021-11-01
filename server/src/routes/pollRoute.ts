import { Router } from "express";
import { changePollStatus, createPoll } from "../controllers/pollController";

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

pollRouter.patch("/:pollId", async (req, res) => {
  const { pollId } = req.params;
  const { hasStarted } = req.body;
  try {
    await changePollStatus(pollId, hasStarted);
    return res.send({ message: "Poll status successfully changed" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Failed to change poll status" });
  }
});

export default pollRouter;
