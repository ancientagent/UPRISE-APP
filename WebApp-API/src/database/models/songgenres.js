'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SongGenres extends Model {}
    SongGenres.associate = (models) => {

        SongGenres.belongsTo(models.Songs,{foreignKey:'songId',as:'songs'});
        SongGenres.belongsTo(models.Genres,{foreignKey:'genreId',as:'genres'});

    };
    
    SongGenres.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        songId: {
            type: DataTypes.INTEGER
        },
        genreId:{
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
        modelName: 'SongGenres',
    });
    return SongGenres;
};