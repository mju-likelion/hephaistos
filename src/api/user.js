import { Router } from "express";

// import User from "../models/user";

const user = Router();

// 유저 정보
user.get("/:id", async (req, res) => {
  res.json("test");
});

export default user;
