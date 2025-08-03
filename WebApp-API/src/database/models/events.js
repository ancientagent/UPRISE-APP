'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Events extends Model {}

    Events.associate = (models) => {
        Events.belongsTo(models.Band, { foreignKey: 'bandId', as: 'band' });
    };
  
    
    Events.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        thumbnail:{
            type:DataTypes.STRING
        },
        eventName: {
            type: DataTypes.STRING
        },
        description:{
            type: DataTypes.STRING
        },
        startTime:{
            type:DataTypes.DATE
        },
        endTime:{
            type:DataTypes.DATE
        },
        latitude:{
            type:DataTypes.FLOAT
        },
        longitude:{
            type:DataTypes.FLOAT
        },
        location:{
            type:DataTypes.STRING
        },
        cityName:{
            type:DataTypes.STRING
        },
        stateName:{
            type:DataTypes.STRING
        },
        country:{
            type:DataTypes.STRING
        },
        bandId:{
            type:DataTypes.INTEGER
        },
        createdBy:{
            type:DataTypes.INTEGER
        },
        googleEventId:{
            type:DataTypes.STRING
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        deletedAt: {
            type: DataTypes.DATE
        }

    },
    {
        sequelize,
        modelName: 'Events',
        paranoid: true
    });
    return Events;
};