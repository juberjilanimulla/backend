import { Router } from "express";
import {
  createpostHandler,
  deletepostHandler,
  getallpostHandler,
  updatepostHandler,
} from "../controllers/postcontroller.js";

const postRouter = Router();

postRouter.get("/", getallpostHandler);
postRouter.post("/create", createpostHandler);
postRouter.post("/update", updatepostHandler);
postRouter.post("/delete", deletepostHandler);
export default postRouter;
