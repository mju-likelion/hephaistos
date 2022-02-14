import { Router } from "express";

// import User from "../models/user";

const users = Router();

// 유저 정보
users.get("/:id", async (req, res) => {
  res.json("test");
});

export default users;
