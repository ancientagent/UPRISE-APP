'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Roles extends Model {}
    Roles.associate = (models) => {
        Roles.belongsTo(models.User, { foreignKey: 'id', as: 'role' });
    };
    Roles.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'Roles',
        }
    );
    return Roles;
};
