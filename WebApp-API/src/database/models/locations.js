'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Locations extends Model {}
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //     define association here
    //   }
  
    Locations.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        street:{
            type:DataTypes.STRING
        },
        city:{
            type: DataTypes.STRING,
  
        },
        state: {
            type: DataTypes.STRING,
            
        },
        zipcode:{
            type:DataTypes.INTEGER,
        },
        country:{
            type:DataTypes.STRING
        },
        latitude:{
            type:DataTypes.FLOAT
        },
        longitude:{
            type:DataTypes.FLOAT
        },
        userId:{
            type:DataTypes.INTEGER
        },
    },
    {
        sequelize,
        modelName: 'Locations',
    });
    return Locations;
};