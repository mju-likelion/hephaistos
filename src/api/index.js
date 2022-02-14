import { Router } from "express";

import applyRouter from "./apply";
import authRouter from "./auth";

const api = Router();

api.use("/apply", applyRouter);
api.use("/auth", authRouter);

export default api;
