import { Router } from "express";

import applyRouter from "./apply";
import authRouter from "./auth";
import questionRouter from "./question";
import userRouter from "./user";

const api = Router();

api.use("/apply", applyRouter);
api.use("/auth", authRouter);
api.use("/question", questionRouter);
api.use("/user", userRouter);

export default api;
