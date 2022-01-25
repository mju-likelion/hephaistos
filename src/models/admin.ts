const {Sequelize} = require("sequelize");

export default class Admin extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            ID: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            univ_verify: {
                type: Sequelize.BOOLEAN(10),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,
            modelName: 'Admin',
            tableName: 'admins',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db){
        db.Admin.belongsTo(db.Univ, { foreignKey: 'UnivId', sourceKey: 'id'});
    }
};