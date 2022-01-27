import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";

import User from "../models/user";

dotenv.config();
const auth = express();

// 이메일 인증 보내기 (POST /api/auth/email-verify)
auth.post("/email-verify", async (req, res) => {
  // 해시코드 생성
  const code = bcrypt.randomBytes(6).toString("hex");
  // redis 코드 저장

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
  // 메일 옵션 지정
  transporter.sendMail(
    {
      from: `pjm2207@likelion.org`,
      to: req.body.email,
      subject: "멋쟁이사자처럼 10기 이메일인증",
      html: `<a href=http://localhost:3000/api/auth/email-verify/${code}>인증하기</a>`,
    },
    err => {
      if (err) {
        res.status(400).json({
          error: {
            message: "이메일 형식이 올바르지 않습니다.",
          },
        });
      }
      res.send(code);
      transporter.close();
    },
  );
});

// 이메일인증(POST /api/auth/email-verify/:emailToken )
// auth.post('auth/email-verify/:emailToken', (req, res, next) => {
//    const emailToken = req.params.emailToken;
// redis 안에 값과 비교
// res
// });

// 회원가입(POST /api/auth/sign-up) =>
/* eslint-disable */
auth.post("/sign-up", async (req, res) => {
  const { email, password, name, phone, apply_univ, major, email_verify, status } = req.body;
  // body에 값이 하나라도 존재하지 않는다면
  if (!email || !password || !name || !phone || !apply_univ || !major || !email_verify) {
    return res.status(400).json({
      error: {
        message: "회원가입 형식이 올바르지 않습니다.",
      },
    });
  }
  const hash = await bcrypt.hash(password, 10);

  const userEmail = await User.findOne({ where: { email } });
  if (userEmail) {
    // 디비에 이메일이 존재하고 이메일 인증이 true
    await User.update(
      {
        email,
        password: hash,
        name,
        phone,
        apply_univ,
        major,
        status,
        email_verify,
      },
      { where: { email } },
    );
    return res.status(200).json({
      data: {
        message: "회원가입이 완료되었습니다.",
      },
    });
  }
  // 디비에 이메일이 존재하지 않으면
  return res.status(403).json({
    error: {
      message: "이메일 인증을 먼저 완료해주세요.",
    },
  });
});

export default auth;
