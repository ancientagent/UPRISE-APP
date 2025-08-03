'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BandMembers extends Model {}
    BandMembers.associate = (models) => {

        BandMembers.belongsTo(models.Band,{foreignKey:'bandId',as:'band'});
        BandMembers.belongsTo(models.User, { foreignKey: 'userId', as: 'users' });
    };

    BandMembers.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        bandId:{
            type:DataTypes.INTEGER
        },
        userId: {
            type: DataTypes.INTEGER
        },
        bandRoleId:{
            type: DataTypes.INTEGER
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
       
    }, {
        sequelize,
        modelName: 'BandMembers',
    });
    return BandMembers;
};