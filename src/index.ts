import cors from "cors";
import express from "express";

import authRouter from "./api";
import models from "./models";

const ENV_LIST = ["JWT_SECRET", "NODEMAILER_USER", "NODEMAILER_PASS", "DATABASE_URL"];

const app = express();
const port = process.env.PORT ? +process.env.PORT : 3000;

ENV_LIST.forEach(env => {
  if (!process.env[env]) {
    throw Error(`${env} 환경변수가 없습니다.`);
  }
});

const corsOptions = {
  origin: [/^https?:\/\/apply.mju-likelion.com$/, /^https?:\/\/local-apply.mju-likelion.com:3000$/],
};

app.use(cors(corsOptions));

app.get("/", async (req, res) => {
  res.send("hello world");
});

// 디비 연결
models.sequelize.sync({ force: false });

// 디비 확인
app.get("/db-healthcheck", async (req, res) => {
  try {
    await models.sequelize.authenticate();
    res.send("Connection has been established successfully.");
  } catch (error) {
    res.send(`Unable to connect to the database: ", ${error}`);
  }
});

app.use(express.json());
app.use("/api", authRouter);

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`App listening at http://localhost:${port}`);
});
