import { Router } from "express";

import { dateChecker } from "../middleware/timeLimit";

import applyRouter from "./apply";
import authRouter from "./auth";
import questionRouter from "./questions";
import sendMailRouter from "./sendMail";
import userRouter from "./users";

const api = Router();

api.use("/apply", dateChecker, applyRouter);
api.use("/auth", authRouter);
api.use("/questions", questionRouter);
api.use("/user", userRouter);
api.use("/sendMail", sendMailRouter);

export default api;
