import { Router } from "express";

import { loginChecker } from "../middleware/checker";

// import User from "../models/user";

const users = Router();

// 유저 정보
users.get("/:id", loginChecker, async (req, res) => {
  res.json("test");
});

export default users;
