import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Router } from "express";
import { sign } from "jsonwebtoken";
import { random, times } from "lodash";
import nodemailer from "nodemailer";
import { createClient } from "redis";

import { signVaildator, emailVaildator } from "../middleware/validator";
import User from "../models/user";

dotenv.config();
const auth = Router();
// redis 서버 연결
const redisClient = createClient({
  host: process.env.RADIS_HOST,
  port: process.env.RADIS_PORT,
});
redisClient.connect();

// 이메일 인증 보내기 (POST /api/auth/email-verify)
auth.post("/email-verify", emailVaildator, async (req, res) => {
  // eslint-disable-next-line
  const { email } = req.body;
  // 토큰 생성
  let token = times(6, () => random(35).toString(36)).join("");
  // eslint-disable-next-line
  while (await redisClient.get(token)) {
    // redis에 토큰이 같을시 재발행
    token = times(6, () => random(35).toString(36)).join("");
  }
  // 메일 옵션 지정
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
  // 메일 전송
  transporter.sendMail(
    {
      from: `pjm2207@likelion.org`,
      to: email,
      subject: "멋쟁이사자처럼 10기 이메일인증",
      html: `<a href=http://localhost:3000/api/auth/email-verify/${token}>인증하기</a>`,
    },
    err => {
      if (err) {
        return res.status(400).json({
          error: {
            message: "이메일 형식이 올바르지 않습니다.",
          },
        });
      }
      transporter.close();
      redisClient.set(token, email); // redis에 emailCode key:value 에 token:email 저장
      redisClient.expire(token, 24 * 60 * 60); // 이메일 인증기한은 1일
      return res.json({
        data: {
          message: "인증용 이메일을 보냈습니다. 이메일을 확인해주세요.",
        },
      });
    },
  );
});

// 이메일인증(POST /api/auth/email-verify/:emailToken )
auth.post("/email-verify/:emailToken", async (req, res) => {
  // eslint-disable-next-line
  const { emailToken } = req.params;
  // redis의 code가 담긴 list를 반환
  const redisToken = await redisClient.get(emailToken);
  // list에 code가 있을시 User.create
  if (redisToken) {
    await User.create({
      email: redisToken,
      email_verify: true,
      password: "",
      name: "",
      phone: "",
      major: "",
      status: "0",
    });
    redisClient.del(emailToken);
    return res.status(200).json({
      data: {
        message: "이메일 인증에 성공하셨습니다",
        // email,
      },
    });
  }
  return res.status(404).json({
    error: {
      message: "요청이 올바르지 않습니다. 이메일 인증을 다시 시도해주세요.",
    },
  });
});

// 회원가입(POST /api/auth/sign-up) =>
/* eslint-disable */
auth.post("/sign-up", signVaildator, async (req, res) => {
  const { email, password, name, phone, univ, major } = req.body;
  // body에 값이 하나라도 존재하지 않는다면
  const hash = await bcrypt.hash(password, 10);

  const userEmail = await User.findOne({ where: { email } });
  if (userEmail && userEmail.email_verify) {
    // 디비에 이메일이 존재하고 이메일 인증이 true
    await User.update(
      {
        password: hash,
        name,
        phone,
        major,
        univ,
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

auth.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmail = await User.findOne({ where: { email } });
    if (userEmail) {
      if (!userEmail.email_verify) {
        return res.status(403).json({
          error: {
            message: "이메일을 먼저 인증해 주세요.",
          },
        });
      }
      const vaildPassword = await bcrypt.compare(password, userEmail.password);
      if (vaildPassword && userEmail) {
        const token = sign(
          {
            email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1days",
            issuer: "LikeLion",
          },
        );
        return res.status(200).json({
          data: {
            jwt: token,
          },
        });
      }
      return res.status(403).json({
        error: {
          message: "이메일 또는 비밀번호가 바르지 않습니다.",
        },
      });
    }
    res.status(403).json({
      error: {
        message: "계정이 존재하지 않습니다.",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: {
        message: "요청이 올바르지 않습니다.",
      },
    });
  }
});

export default auth;
