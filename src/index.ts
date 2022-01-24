import dotenv from "dotenv";
import express from "express";
import { Sequelize } from "sequelize";

dotenv.config();

const app = express();
const port = 3000;

const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgresql://localhost:5432/hephaistos",
);

app.get("/", async (req, res) => {
  res.send("hello world");
});

app.get("/db-healthcheck", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send("Connection has been established successfully.");
  } catch (error) {
    res.send(`Unable to connect to the database: ", ${error}`);
  }
});

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`App listening at http://localhost:${port}`);
});
