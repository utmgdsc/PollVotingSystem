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

export default pollRouter;
