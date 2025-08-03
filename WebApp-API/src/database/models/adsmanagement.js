'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AdsManagement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        // static associate(models) {
        //     // define association here
        // }
    }
    AdsManagement.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        banner:{
            type:DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING
        },
        description:{
            type : DataTypes.STRING
        },
        link:{
            type : DataTypes.STRING
        },
        live:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        thumbnail:{
            type:DataTypes.STRING
        },
        city:{
            type : DataTypes.STRING
        },
        state:{
            type : DataTypes.STRING
        },
        country:{
            type : DataTypes.STRING
        },
        latitude:{
            type:DataTypes.FLOAT
        },
        longitude:{
            type:DataTypes.FLOAT
        },
        bandId:{
            type:DataTypes.INTEGER
        },
        createdBy:{
            type:DataTypes.INTEGER
        },
        blocked:{
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
        modelName: 'AdsManagement',
    });
    return AdsManagement;
};