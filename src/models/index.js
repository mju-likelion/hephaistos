import dotenv from "dotenv";
import { Sequelize } from "sequelize";

import Admin from "./admin";
import Apply from "./apply";
import Question from "./question";
import Univ from "./univ";
import User from "./user";

dotenv.config();

const env = process.env.NODE_ENV || "development";
const db = {};

const sequelize = {
  new: Sequelize(process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD)[env],
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;
db.Admin = Admin;
db.Apply = Apply;
db.Question = Question;
db.Univ = Univ;

User.init(sequelize);
Admin.init(sequelize);
Apply.init(sequelize);
Question.init(sequelize);
Univ.init(sequelize);

User.associate(db);
Admin.associate(db);
Apply.associate(db);
Question.associate(db);
Univ.associate(db);

export default db;
