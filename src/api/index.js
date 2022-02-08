import { Router } from "express";

import authRouter from "./auth";

const api = Router();

api.use("/auth", authRouter);

export default api;
