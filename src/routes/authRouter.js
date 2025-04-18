import { Router } from "express";
import { signupHandler } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/signup", signupHandler);

export default authRouter;
