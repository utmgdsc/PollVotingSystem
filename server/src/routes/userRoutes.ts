import { Router } from "express";
import { getUser } from "../controllers/userController";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  try {
    const result = await getUser(req.headers.utorid);
    return res.status(result.status).send(result.data);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

export default userRouter;
