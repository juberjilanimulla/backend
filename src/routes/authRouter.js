import { Router } from "express";
import { loginHandler, signupHandler } from "../controllers/authController.js";
const authRouter = Router();

authRouter.post("/signup", signupHandler);
authRouter.post("/login", loginHandler);

export default authRouter;
