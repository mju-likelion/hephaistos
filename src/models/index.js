import dotenv from "dotenv";
import { Sequelize } from "sequelize";

import Admin from "./admin";
import Apply from "./apply";
import Question from "./question";
import User from "./user";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgresql://localhost:5432/hephaistos",
);

const db = {
  sequelize,
  User,
  Admin,
  Apply,
  Question,
};

User.init(sequelize);
Admin.init(sequelize);
Apply.init(sequelize);
Question.init(sequelize);

User.associate(db);
Apply.associate(db);

export default db;
