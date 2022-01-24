const Sequelize = require('sequelize');
const User = require('./user');
const Admin = require('./admin');
const Apply = require('./apply');
const Question = require('./question');
const Univ = require('./univ');


const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

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

module.exports = db;