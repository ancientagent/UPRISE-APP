'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserStationPrefrence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        // static associate(models) {
        //     // define association here
        // }
    }
    UserStationPrefrence.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        userId: {
            type: DataTypes.INTEGER
        },
        stationPrefrence:{
            type: DataTypes.STRING
        },
        stationType: {
            type:DataTypes.ENUM,
            values:['1','2','3'], // 1.City 2.State 3.National
            defaultValue:'1'
        },
        active: {
            type:DataTypes.BOOLEAN
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
        modelName: 'UserStationPrefrence',
    });
    return UserStationPrefrence;
};