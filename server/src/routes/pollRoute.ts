import { Router } from "express";
import { createPoll } from "../controllers/pollController";

const pollRouter = Router();

pollRouter.post("/", async (req, res) => {
  const { name, description, courseCode, questions } = req.body;
  try {
    const poll = {
      name,
      description,
      courseCode,
      questions,
      running: false,
      created: new Date(),
    };
    const result = await createPoll(poll);
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Poll creation failed" });
  }
});

export default pollRouter;
