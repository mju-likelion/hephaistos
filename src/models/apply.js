import Sequelize from "sequelize";

export default class Apply extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        part: {
          type: Sequelize.ENUM("design", "development", "manage"),
          allowNull: false,
        },
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
        timestamps: true,
        underscored: false,
        paranoid: false,
        modelName: "Apply",
        tableName: "applys",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },
    );
  }

  static associate(db) {
    db.Apply.belongsTo(db.User, { foreignKey: "UserId", sourceKey: "id" });
  }
}
