import Sequelize from "sequelize";

export default class Question extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        one: {
          type: Sequelize.STRING(1500),
        },
        two: {
          type: Sequelize.STRING(1500),
        },
        three: {
          type: Sequelize.STRING(1500),
        },
        four: {
          type: Sequelize.STRING(1500),
        },
        five: {
          type: Sequelize.STRING(1500),
        },
        six: {
          type: Sequelize.STRING(1500),
        },
        seven: {
          type: Sequelize.STRING(1500),
        },
        eight: {
          type: Sequelize.STRING(1500),
        },
        nine: {
          type: Sequelize.STRING(1500),
        },
        ten: {
          type: Sequelize.STRING(1500),
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        paranoid: false,
        modelName: "Question",
        tableName: "questions",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },
    );
  }

  static associate(db) {
    db.Question.belongsTo(db.Univ, { foreignKey: "UnivId", sourceKey: "id" });
  }
}
