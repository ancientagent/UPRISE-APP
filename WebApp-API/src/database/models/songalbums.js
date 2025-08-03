'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SongAlbums extends Model {}
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
  
    SongAlbums.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        songId: {
            type: DataTypes.INTEGER
        },
        albumId:{
            type:DataTypes.INTEGER
        },
        bandId:{
            type:DataTypes.INTEGER
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
        modelName: 'SongAlbums',
    });
    return SongAlbums;
};