import { Router } from "express";

import Question from "../models/question";
// import Question from "../models/question";

const questions = Router();

// 지원서 질문
questions.get("/", async (req, res) => {
  const question = await Question.findOne({
    attributes: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
  });
  res.json({
    data: {
      questions: Object.values(question?.dataValues),
    },
  });
});

export default questions;
