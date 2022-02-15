import { DataTypes, Model } from "sequelize";

class Apply extends Model {
  static init(sequelize) {
    return super.init(
      {
        applyVerify: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        part: {
          type: DataTypes.ENUM("design", "web", "server"),
          allowNull: false,
        },
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
        modelName: "Apply",
        tableName: "apply",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },
    );
  }

  static associate(db) {
    db.Apply.belongsTo(db.User, {
      foreignKey: { name: "userId", allowNull: false },
      sourceKey: "id",
    });
  }
}

export default Apply;
