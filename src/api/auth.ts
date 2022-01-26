import crypto from "crypto";

import express from "express";
import nodemailer from "nodemailer";

const router = express();

// 이메일 인증 보내기 (POST /api/auth/email-verify)
router.post("/email-verify", async (req, res) => {
  // 해시코드 생성
  const code = crypto.randomBytes(6).toString("hex");

  let emailTemplete; // 보낼 메일

  res.render("src/views/emailTest.html", { authCode: code }, (err, data) => {
    if (err) {
      res.json({
        error: {
          message: "이메일 형식이 올바르지 않습니다.",
        },
      });
    }
    emailTemplete = data;
  });

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
      html: emailTemplete,
    },
    (err: any) => {
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
// router.post('auth/email-verify/:emailToken', (req, res, next) => {
//   const emailToken = req.params.emailToken;
// });
// 회원가입(POST /api/auth/sign-up)
// router.post('auth/sign-up', (req, res, next) => {

// });

export default router;
