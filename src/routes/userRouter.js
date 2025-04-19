import { Router } from "express";
import { profileHandler } from "../controllers/usercontroller.js";

const userRouter = Router();

userRouter.get("/profile", profileHandler);
export default userRouter;
