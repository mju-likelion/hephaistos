import { DataTypes, Model } from "sequelize";

class Question extends Model {
  static init(sequelize) {
    return super.init(
      {
        one: {
          type: DataTypes.STRING(1500),
        },
        two: {
          type: DataTypes.STRING(1500),
        },
        three: {
          type: DataTypes.STRING(1500),
        },
        four: {
          type: DataTypes.STRING(1500),
        },
        five: {
          type: DataTypes.STRING(1500),
        },
        six: {
          type: DataTypes.STRING(1500),
        },
        seven: {
          type: DataTypes.STRING(1500),
        },
        eight: {
          type: DataTypes.STRING(1500),
        },
        nine: {
          type: DataTypes.STRING(1500),
        },
        ten: {
          type: DataTypes.STRING(1500),
        },
      },
      {
        sequelize,
        modelName: "Question",
        tableName: "question",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },
    );
  }
}

export default Question;
