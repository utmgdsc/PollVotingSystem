import { Router } from "express";
import { changePollStatus, createPoll, getStudents} from "../controllers/pollController";

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

pollRouter.get("/students/:courseCode", async (req, res) => {
  const{ courseCode} = req.params;
  const { startTime, endTime } = req.body;
  try {
    const result = await getStudents(courseCode, new Date(startTime) , new Date(endTime));
    return res.status(200).send(result);
  } catch (err){
    return res.status(500).send({ message: "Failed to find students" });
  }
});

export default pollRouter;
