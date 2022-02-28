import { Router } from "express";
import { isEmpty } from "lodash";

import { loginChecker, adminChecker } from "../middleware/checker";
import Question from "../models/question";

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

questions.put("/", loginChecker, adminChecker, async (req, res) => {
  // eslint-disable-next-line
  const { questions } = req.body?.data;
  if (!questions) {
    return res.status(403).json({
      error: {
        message: "요청이 올바르지 않습니다.",
      },
    });
  }
  await Question.update(
    {
      one: isEmpty(questions[0]) ? null : questions[0],
      two: isEmpty(questions[1]) ? null : questions[1],
      three: isEmpty(questions[2]) ? null : questions[2],
      four: isEmpty(questions[3]) ? null : questions[3],
      five: isEmpty(questions[4]) ? null : questions[4],
      six: isEmpty(questions[5]) ? null : questions[5],
      seven: isEmpty(questions[6]) ? null : questions[6],
      eight: isEmpty(questions[7]) ? null : questions[7],
      nine: isEmpty(questions[8]) ? null : questions[8],
      ten: isEmpty(questions[9]) ? null : questions[9],
    },
    { where: { id: 1 } },
  );
  return res.json({
    data: {
      message: "정상적으로 변경되었습니다.",
    },
  });
});
export default questions;
