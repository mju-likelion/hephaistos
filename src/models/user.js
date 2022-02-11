import { DataTypes, Model } from "sequelize";

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(5),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        emailVerify: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING(15),
          allowNull: false,
        },
        major: {
          type: DataTypes.STRING(15),
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(
            "complete",
            "first-fail",
            "first-pass",
            "second-fail",
            "second-pass",
          ),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "user",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },
    );
  }

  static associate(db) {
    db.User.hasOne(db.Apply, { foreignKey: { name: "userId", allowNull: false }, sourceKey: "id" });
  }
}

export default User;
