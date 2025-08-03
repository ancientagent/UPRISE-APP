'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserGenrePrefrences extends Model {}
    UserGenrePrefrences.init({
        userId: DataTypes.INTEGER,
        genreId: DataTypes.INTEGER,
    }, 
    {
        sequelize,
        modelName: 'UserGenrePrefrences',
    });
    return UserGenrePrefrences;
};