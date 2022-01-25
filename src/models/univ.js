import Sequelize from "sequelize";

export default class Univ extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        paranoid: false,
        modelName: "Univ",
        tableName: "univs",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },
    );
  }

  static associate(db) {
    db.Univ.hasOne(db.Question, { foreignKey: "UnivId", sourceKey: "id" });
    db.Univ.hasOne(db.Admin, { foreignKey: "UnivId", sourceKey: "id" });
    db.Univ.hasMany(db.User, { foreignKey: "UnivId", sourceKey: "id" });
  }
}
