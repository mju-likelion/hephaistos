import { Router } from "express";

// import Question from "../models/question";

const questions = Router();

// 지원서 질문
questions.get("/:id", async (req, res) => {
  res.json("test");
});

export default questions;
