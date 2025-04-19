import { Router } from "express";
import {
  createcommentHandler,
  deletecommentHandler,
  getcommentHandler,
} from "../controllers/commentcontroller.js";

const commentRouter = Router();
commentRouter.post("/create", createcommentHandler);
commentRouter.post("/delete", deletecommentHandler);
commentRouter.get("/", getcommentHandler);
export default commentRouter;
