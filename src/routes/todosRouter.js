import { Router } from "express";
import {
  createtodosHandler,
  deletetodosHandler,
  getalltodosHandler,
  updatetodosHandler,
} from "../controllers/todoscontroller.js";

const todosRouter = Router();

todosRouter.post("/getall", getalltodosHandler);
todosRouter.post("/create", createtodosHandler);
todosRouter.post("/update", updatetodosHandler);
todosRouter.post("/delete", deletetodosHandler);
export default todosRouter;
