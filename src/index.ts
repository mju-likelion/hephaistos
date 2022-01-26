import express from "express";

import models from "./models";

const app = express();
const port = 3000;

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

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`App listening at http://localhost:${port}`);
});
