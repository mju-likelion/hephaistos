import { Router } from "express";

// import Question from "../models/question";

const questions = Router();

// 유저 정보
questions.get("/:id", async (req, res) => {
  res.json("test");
});

export default questions;
