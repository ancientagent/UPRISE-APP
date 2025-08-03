'use strict';
const { Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserFollows extends Model {}
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
  
    UserFollows.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        followerId: {
            type: DataTypes.INTEGER
        },
        followeeId: DataTypes.INTEGER,
        status: {
            type: DataTypes.ENUM,
            values: ['ACCEPTED', 'REJECTED', 'CANCELLED','PENDING'],
            defaultValue:'ACCEPTED'
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
        modelName: 'UserFollows',
    });
    return UserFollows;
};