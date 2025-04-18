import { Router } from "express";
import { createpostHandler } from "../controllers/postcontroller.js";

const postRouter = Router();

postRouter.post("/create", createpostHandler);

export default postRouter;
