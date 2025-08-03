'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Band extends Model {}
    Band.associate = (models) => {
        Band.hasMany(models.Events, { foreignKey: 'bandId', as: 'band' });
        Band.hasOne(models.BandMembers, { foreignKey: 'bandId', as: 'bandMembers' });
        //Band.belongsTo(models.User,{foreignKey: 'createdBy',as :'bandDetails'});
    };
  
    Band.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        title: {
            type: DataTypes.STRING
        },
        cityName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        stateName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description:{
            type: DataTypes.STRING
        },
        logo:{
            type:DataTypes.STRING
        },
        facebook:{
            type:DataTypes.STRING
        },
        instagram:{
            type:DataTypes.STRING
        },
        youtube:{
            type:DataTypes.STRING
        },
        twitter:{
            type:DataTypes.STRING
        },
        createdBy:{
            type:DataTypes.INTEGER
        },
        status:{
            type:DataTypes.ENUM,
            values:['ACTIVE','INACTIVE','BLOCKED'],
            defaultValue:'ACTIVE'
        },
        promosEnabled:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
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
        modelName: 'Band',
    });
    return Band;
};