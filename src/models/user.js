import { DataTypes, Model } from "sequelize";

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(5),
        },
        email: {
          type: DataTypes.STRING(30),
          unique: true,
          allowNull: false,
        },
        emailVerify: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        emailToken: DataTypes.STRING,
        password: {
          type: DataTypes.STRING,
        },
        phone: {
          type: DataTypes.STRING(15),
        },
        major: {
          type: DataTypes.STRING(15),
        },
        status: {
          type: DataTypes.ENUM(
            "writing",
            "complete",
            "first-fail",
            "first-pass",
            "second-fail",
            "second-pass",
          ),
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
