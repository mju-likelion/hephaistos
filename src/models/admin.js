import { DataTypes, Model } from "sequelize";

class Admin extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Admin",
        tableName: "admin",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },
    );
  }
}

export default Admin;
