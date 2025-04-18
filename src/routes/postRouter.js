import { Router } from "express";
import {
  createpostHandler,
  getallpostHandler,
} from "../controllers/postcontroller.js";

const postRouter = Router();

postRouter.get("/", getallpostHandler);
postRouter.post("/create", createpostHandler);

export default postRouter;
