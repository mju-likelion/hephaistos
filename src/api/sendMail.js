import { parse } from "url";

import { Router } from "express";
import nodemailer from "nodemailer";

import { adminChecker, loginChecker } from "../middleware/checker";
import User from "../models/user";

const sendMail = Router();
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

sendMail.get("/", loginChecker, adminChecker, async (req, res) => {
  const { query } = parse(req.url, true);
  const status = ["first-fail", "first-pass", "second-fail", "second-pass"];

  if (!status.includes(query.status)) {
    return res.status(400).json({
      error: {
        message: "요청이 올바르지 않습니다.",
      },
    });
  }
  const firstFailUsers = await User.findAll({
    attributes: ["email"],
    where: {
      status: query.status,
    },
    raw: true,
  });
  await transporter.sendMail({
    from: `mju@likelion.org`,
    to: firstFailUsers.map(user => user.email),
    subject: `멋쟁이사자처럼 ${
      query.status.includes("first") ? "1차" : "최종"
    }결과 안내 메일입니다.`,
    html: { path: `src/template/${query.status}.ejs` },
  });
  return res.json({
    data: {
      message: `${query.status.includes("first") ? "1차 " : "최종 "}${
        query.status.includes("fail") ? "불합격" : "합격"
      } 안내 메일이 전송되었습니다.`,
    },
  });
});

export default sendMail;
