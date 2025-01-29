import { Router } from "express";
import { signinHandler, signupHandler } from "../controller/user.js";
export const authRouter = Router();

authRouter.post("/login", signinHandler);

authRouter.post("/register", signupHandler);
