import { parse } from "url";

import dotenv from "dotenv";
import { renderFile } from "ejs";
import { Router } from "express";
import { verify } from "jsonwebtoken";
import { isEmpty, omit } from "lodash";
import nodemailer from "nodemailer";

import { loginChecker, adminChecker } from "../middleware/checker";
import { submitValidator } from "../middleware/validator";
import Apply from "../models/apply";
import User from "../models/user";

const apply = Router();
dotenv.config();
// 지원서 전체보기
apply.get("/", loginChecker, adminChecker, async (req, res) => {
  const { query } = parse(req.url, true);
  const users = await User.findAll({
    include: {
      model: Apply,
      attributes: [],
      where: { part: query?.part ? query.part.split(":") : ["design", "web", "server"] },
    },
    attributes: ["id", "email", "name", "major"],
    where: {
      status: query?.status
        ? query.status.split(":")
        : ["complete", "first-fail", "first-pass", "second-fail", "second-pass"],
    },
    order: query?.sort ? [query.sort.split("_")] : [["updatedAt", "asc"]],
    limit: query?.size ? query.size : 10,
    offset: query?.page ? (query.page - 1) * (query?.size ? query.size : 10) : 0,
  });
  const userCount = await User.count({
    include: {
      model: Apply,
      attributes: [],
      where: { part: query?.part ? query.part.split(":") : ["design", "web", "server"] },
    },
    where: {
      status: query?.status
        ? query.status.split(":")
        : ["complete", "first-fail", "first-pass", "second-fail", "second-pass"],
    },
  });
  return res.json({
    links: {
      prev_uri:
        query?.page && !(query?.page === "1")
          ? `/applylists?${parse(req.url, false).query.replace(
              `&page=${query.page}`,
              `&page=${+query.page - 1}`,
            )}`
          : null,
      next_uri:
        userCount % (query?.page ? query.page * (query?.size ? query.size : 10) : 1) > 1
          ? `/applylists?${parse(req.url, false).query.replace(
              `&page=${query.page}`,
              `&page=${+query.page + 1}`,
            )}`
          : null,
    },
    data: {
      users,
    },
  });
});

// 지원서 전체 개수
apply.get("/total-count", loginChecker, adminChecker, async (req, res) => {
  res.json({
    meta: {
      count: await Apply.count({ where: { applyVerify: true } }),
    },
  });
});

// 지원자 보기
apply.get("/:id", loginChecker, async (req, res) => {
  // eslint-disable-next-line
  const { id } = req.params;
  // eslint-disable-next-line
  if (isNaN(id) && id !== "me") {
    return res.status(403).json({
      error: {
        message: "요청이 올바르지 않습니다.",
      },
    });
  }

  const token = verify(req.header("X-Access-Token"), process.env.JWT_SECRET);
  if (token?.isAdmin) {
    const user = await User.findOne({
      attributes: ["id", "email", "phone", "name", "major", "status"],
      where: { id },
    });
    if (!user) {
      return res.status(403).json({
        error: {
          message: "요청이 올바르지 않습니다.",
        },
      });
    }
    const applyData = await Apply.findOne({ where: { userId: user.id } });
    if (!applyData) {
      return res.status(404).json({
        error: {
          message: "아직 지원서가 제출된 적이 없습니다. 지원서를 먼저 제출해주세요.",
        },
      });
    }
    return res.json({
      data: {
        user,
        apply: {
          part: applyData.part,
          answers: Object.values(
            omit(applyData.dataValues, [
              "id",
              "applyVerify",
              "part",
              "createdAt",
              "updatedAt",
              "userId",
            ]),
          ),
        },
      },
    });
  }

  // id === me 면 바로 자기 자신의 apply 반환
  if (id === "me") {
    const user = await User.findOne({
      attributes: ["id", "email", "phone", "name", "major", "status"],
      where: { id: token.id },
    });
    if (!user) {
      return res.status(403).json({
        error: {
          message: "요청이 올바르지 않습니다.",
        },
      });
    }
    const applyData = await Apply.findOne({ where: { userId: user.id } });
    if (!applyData) {
      return res.status(404).json({
        error: {
          message: "아직 지원서가 제출된 적이 없습니다. 지원서를 먼저 제출해주세요.",
        },
      });
    }
    return res.json({
      data: {
        user,
        apply: {
          part: applyData.part,
          answers: Object.values(
            omit(applyData.dataValues, [
              "id",
              "applyVerify",
              "part",
              "createdAt",
              "updatedAt",
              "userId",
            ]),
          ),
        },
      },
    });
  }

  const user = await User.findOne({
    attributes: ["id", "email", "phone", "name", "major"],
    where: { id: token.id },
  });
  const applyData = await Apply.findOne({ where: { userId: user.id } });
  if (!applyData) {
    return res.status(404).json({
      error: {
        message: "아직 지원서가 제출된 적이 없습니다. 지원서를 먼저 제출해주세요.",
      },
    });
  }
  return res.json({
    data: user,
    apply: {
      part: applyData.part,
      answer: Object.values(
        omit(applyData.dataValues, [
          "id",
          "applyVerify",
          "part",
          "createdAt",
          "updatedAt",
          "userId",
          "status",
        ]),
      ),
    },
  });
});

// 임시저장
apply.put("/", loginChecker, submitValidator, async (req, res) => {
  // eslint-disable-next-line
  const applyData = req.body.data.apply;
  const token = verify(req.header("X-Access-Token"), process.env.JWT_SECRET);
  const user = await User.findOne({ attributes: ["id"], where: { id: token.id } });
  const applyCheck = await Apply.findOne({ where: { userId: user.id } });
  if (applyCheck) {
    if (applyCheck.applyVerify) {
      return res.status(403).json({
        error: {
          message: "이미 제출이 완료된 상태입니다.",
        },
      });
    }
    await Apply.update(
      {
        part: applyData.part,
        one: isEmpty(applyData.one) ? null : applyData.one,
        two: isEmpty(applyData.two) ? null : applyData.two,
        three: isEmpty(applyData.three) ? null : applyData.three,
        four: isEmpty(applyData.four) ? null : applyData.four,
        five: isEmpty(applyData.five) ? null : applyData.five,
        six: isEmpty(applyData.six) ? null : applyData.six,
        seven: isEmpty(applyData.seven) ? null : applyData.seven,
        eight: isEmpty(applyData.eight) ? null : applyData.eight,
        nine: isEmpty(applyData.nine) ? null : applyData.nine,
        ten: isEmpty(applyData.ten) ? null : applyData.ten,
      },
      { where: { userId: user.id } },
    );
    return res.json({
      data: {
        message:
          "지원서가 임시저장 되었습니다. 임시저장만으로는 제출되지않습니다. 최종 제출 이후에는 확인 및 수정이 불가능 합니다.",
      },
    });
  }
  await Apply.create({
    applyVerify: false,
    part: applyData.part,
    one: isEmpty(applyData.one) ? null : applyData.one,
    two: isEmpty(applyData.two) ? null : applyData.two,
    three: isEmpty(applyData.three) ? null : applyData.three,
    four: isEmpty(applyData.four) ? null : applyData.four,
    five: isEmpty(applyData.five) ? null : applyData.five,
    six: isEmpty(applyData.six) ? null : applyData.six,
    seven: isEmpty(applyData.seven) ? null : applyData.seven,
    eight: isEmpty(applyData.eight) ? null : applyData.eight,
    nine: isEmpty(applyData.nine) ? null : applyData.nine,
    ten: isEmpty(applyData.ten) ? null : applyData.ten,
    userId: user.id,
  });
  return res.json({
    data: {
      message:
        "지원서가 임시저장 되었습니다. 임시저장만으로는 제출되지않습니다. 최종 제출 이후에는 확인 및 수정이 불가능 합니다.",
    },
  });
});

// 제출
apply.post("/", loginChecker, submitValidator, async (req, res) => {
  // eslint-disable-next-line
  const applyData = req.body.data.apply;
  const token = verify(req.header("X-Access-Token"), process.env.JWT_SECRET);
  const user = await User.findOne({ where: { id: token.id } });
  const applyCheck = await Apply.findOne({ where: { userId: user.id } });
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
  let emailTemplete;
  renderFile("src/template/complete.ejs", { user: user.name }, (err, data) => {
    if (err) {
      return err;
    }
    emailTemplete = data;
    return 0;
  });
  if (applyCheck) {
    if (applyCheck.applyVerify) {
      return res.status(403).json({
        error: {
          message: "이미 제출이 완료된 상태입니다.",
        },
      });
    }
    await Apply.update(
      {
        applyVerify: true,
        part: applyData.part,
        one: isEmpty(applyData.one) ? null : applyData.one,
        two: isEmpty(applyData.two) ? null : applyData.two,
        three: isEmpty(applyData.three) ? null : applyData.three,
        four: isEmpty(applyData.four) ? null : applyData.four,
        five: isEmpty(applyData.five) ? null : applyData.five,
        six: isEmpty(applyData.six) ? null : applyData.six,
        seven: isEmpty(applyData.seven) ? null : applyData.seven,
        eight: isEmpty(applyData.eight) ? null : applyData.eight,
        nine: isEmpty(applyData.nine) ? null : applyData.nine,
        ten: isEmpty(applyData.ten) ? null : applyData.ten,
      },
      { where: { userId: user.id } },
    );
    await User.update(
      {
        status: "complete",
      },
      { where: { id: user.id } },
    );
    transporter.sendMail({
      from: `mju@likelion.org`,
      to: user.email,
      subject: "멋쟁이사자처럼 10기 지원확인 메일",
      html: emailTemplete,
    });
    return res.json({
      data: {
        message:
          "지원서가 제출되었습니다. 가입된 이메일로 지원확인 메일이 발송되었습니다. 최종 제출 이후 확인 및 수정이 불가능 합니다",
      },
    });
  }
  await Apply.create({
    applyVerify: true,
    part: applyData.part,
    one: isEmpty(applyData.one) ? null : applyData.one,
    two: isEmpty(applyData.two) ? null : applyData.two,
    three: isEmpty(applyData.three) ? null : applyData.three,
    four: isEmpty(applyData.four) ? null : applyData.four,
    five: isEmpty(applyData.five) ? null : applyData.five,
    six: isEmpty(applyData.six) ? null : applyData.six,
    seven: isEmpty(applyData.seven) ? null : applyData.seven,
    eight: isEmpty(applyData.eight) ? null : applyData.eight,
    nine: isEmpty(applyData.nine) ? null : applyData.nine,
    ten: isEmpty(applyData.ten) ? null : applyData.ten,
    userId: user.id,
  });
  await User.update(
    {
      status: "complete",
    },
    { where: { id: user.dataValues.id } },
  );
  transporter.sendMail({
    from: `mju@likelion.org`,
    to: user.email,
    subject: "멋쟁이사자처럼 10기 지원확인 메일",
    html: emailTemplete,
  });
  return res.json({
    data: {
      message:
        "지원서가 제출되었습니다. 가입된 이메일로 지원확인 메일이 발송되었습니다. 최종 제출 이후 확인 및 수정이 불가능 합니다",
    },
  });
});

apply.put("/:id", loginChecker, adminChecker, async (req, res) => {
  // eslint-disable-next-line
  const { id } = req.params;
  return res.json("test");
});

export default apply;
