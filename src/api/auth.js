import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { renderFile } from "ejs";
import { Router } from "express";
import { sign } from "jsonwebtoken";
import { random, times } from "lodash";
import nodemailer from "nodemailer";

import { signValidator, emailValidator, loginValidator } from "../middleware/validator";
import Admin from "../models/admin";
import User from "../models/user";

dotenv.config();
const auth = Router();

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
// 이메일 인증 보내기 (POST /api/auth/email-verify)
auth.post("/email-verify", emailValidator, async (req, res) => {
  // eslint-disable-next-line
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  const admin = await Admin.findOne({ where: { email } });
  if (user && !user.emailVerify) {
    await User.destroy({ where: { email } });
  }
  if (user?.emailVerify) {
    return res.status(409).json({
      error: {
        message: "이미 가입된 이메일입니다. 로그인을 진행해주세요.",
      },
    });
  }
  if (admin) {
    return res.status(409).json({
      error: {
        message: "이미 가입된 이메일입니다. 로그인을 진행해주세요.",
      },
    });
  }
  // 토큰 생성
  let token = times(6, () => random(35).toString(36)).join("");
  // eslint-disable-next-line
  while (await User.findOne({ where: { major: token } })) {
    // DB에 토큰이 같을시 재발행
    token = times(6, () => random(35).toString(36)).join("");
  }
  let emailTemplete;
  renderFile("src/template/emailVerify.ejs", { token }, (err, data) => {
    if (err) {
      return err;
    }
    emailTemplete = data;
    return 0;
  });
  // 메일 전송
  transporter.sendMail({
    from: `mju@likelion.org`,
    to: email,
    subject: "멋쟁이사자처럼 이메일인증 메일",
    html: emailTemplete,
  });
  await User.create({
    email,
    emailVerify: false,
    emailToken: token,
    password: null,
    name: null,
    phone: null,
    major: null,
    status: "writing",
  });
  return res.json({
    data: {
      message: "인증용 이메일을 보냈습니다. 이메일을 확인해주세요.",
    },
  });
});

// 이메일인증(POST /api/auth/email-verify/:emailToken )
auth.post("/email-verify/:emailToken", async (req, res) => {
  // eslint-disable-next-line
  const { emailToken } = req.params;
  // DB에서 token 가져오기
  const verifyToken = await User.findOne({ where: { emailToken } });
  if (!verifyToken) {
    return res.status(404).json({
      error: {
        message: "요청이 올바르지 않습니다. 이메일 인증을 다시 시도해주세요.",
      },
    });
  }
  await User.update(
    {
      emailToken: null,
      password: null,
      name: null,
      phone: null,
      major: null,
      status: "writing",
    },
    { where: { email: verifyToken.email } },
  );
  return res.status(200).json({
    data: {
      message: "회원가입을 마무리해주세요.",
      email: verifyToken.email,
    },
  });
});

// 회원가입(POST /api/auth/sign-up)
auth.post("/sign-up", signValidator, async (req, res) => {
  // eslint-disable-next-line
  const { email, password, name, phone, major } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const userEmail = await User.findOne({ where: { email } });
  if (!userEmail || userEmail.emailToken) {
    return res.status(403).json({
      error: {
        message: "이메일 인증을 먼저 완료해주세요.",
      },
    });
  }
  await User.update(
    {
      emailVerify: true,
      password: hash,
      name,
      phone,
      major,
    },
    { where: { email } },
  );
  return res.status(200).json({
    data: {
      message: "이메일인증 및 회원가입이 완료되었습니다.",
    },
  });
});

// 로그인
auth.post("/sign-in", loginValidator, async (req, res) => {
  // eslint-disable-next-line
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: {
        message: "정상적인 요청이 아닙니다.",
      },
    });
  }
  const user = await User.findOne({ where: { email } });
  const admin = await Admin.findOne({ where: { email } });
  if (admin) {
    const validPassword = await bcrypt.compare(password, admin.password);
    if (validPassword) {
      const token = sign(
        {
          id: admin.id,
          admin: true,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1days",
          issuer: "LikeLion",
        },
      );
      return res.json({
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
  if (!user) {
    // 유저정보가 DB에 없다면
    return res.status(403).json({
      error: {
        message: "계정이 존재하지 않습니다.",
      },
    });
  }
  if (!user.emailVerify) {
    // 유저가 이메일인증을 안했다면
    return res.status(403).json({
      error: {
        message: "이메일을 먼저 인증해 주세요.",
      },
    });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    // 패스워드가 다르다면
    return res.status(403).json({
      error: {
        message: "이메일 또는 비밀번호가 바르지 않습니다.",
      },
    });
  }
  const token = sign(
    {
      id: user.id,
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
});

// 비밀번호 초기화 (POST /api/auth/reset-password )
auth.post("/reset-password", emailValidator, async (req, res) => {
  // eslint-disable-next-line
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({
      error: {
        message: "해당 이메일로 가입된 아이디가 존재하지 않습니다.",
      },
    });
  }
  if (!user.emailVerify) {
    return res.status(403).json({
      error: {
        message: "이메일 인증을 먼저해주세요",
      },
    });
  }
  // 토큰 생성
  let token = times(6, () => random(35).toString(36)).join("");
  // eslint-disable-next-line
  while (await User.findOne({ where: { major: token } })) {
    // DB에 토큰이 같을시 재발행
    token = times(6, () => random(35).toString(36)).join("");
  }
  await User.update(
    {
      emailToken: token,
    },
    { where: { email } },
  );

  let emailTemplete;
  renderFile("src/template/emailVerify.ejs", { token }, (err, data) => {
    // 이메일 인증 html받을시 수정
    if (err) {
      return err;
    }
    emailTemplete = data;
    return 0;
  });
  // 메일 전송
  transporter.sendMail({
    from: `mju@likelion.org`,
    to: email,
    subject: "멋쟁이사자처럼 10기 비밀번호 인증",
    html: emailTemplete,
  });
  return res.json({
    data: {
      message: "인증용 이메일을 보냈습니다. 이메일을 확인해주세요.",
    },
  });
});

// 비밀번호 변경 (POST /api/auth/find-password/:emailToken )
auth.post("/reset-password/:emailToken", loginValidator, async (req, res) => {
  // eslint-disable-next-line
  const { emailToken } = req.params;
  // eslint-disable-next-line
  const { password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const verifyToken = await User.findOne({ where: { emailToken } });
  if (!verifyToken) {
    return res.status(404).json({
      error: {
        message: "요청이 올바르지 않습니다. 이메일 인증을 다시 시도해주세요.",
      },
    });
  }
  await User.update(
    {
      emailToken: null,
      password: hash,
    },
    { where: { email: verifyToken.email } },
  );
  return res.status(200).json({
    data: {
      message: "정상적으로 비밀번호가 변경되었습니다. 로그인을 해주세요.",
      email: verifyToken.email,
    },
  });
});
export default auth;
