import Sequelize from "sequelize";

export default class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(5),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        email_verify: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        phone: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        apply_univ: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        major: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        status: {
          // (0: 최종지원전, 1: 1차탈락, 2: 1차합격, 3: 2차탈락, 4: 2차합격)
          type: Sequelize.ENUM("0", "1", "2", "3", "4", "5"),
          allowNull: false,
          defaulteValue: "0",
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        paranoid: false,
        modelName: "User",
        tableName: "users",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },
    );
  }

  static associate(db) {
    db.User.hasOne(db.Apply, { foreignKey: "UserId", sourceKey: "id" });
    db.User.belongsTo(db.Univ, { foreignKey: "UnivId", sourceKey: "id" });
  }
}
