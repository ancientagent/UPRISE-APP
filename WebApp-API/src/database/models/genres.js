'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Genres extends Model {}

    Genres.associate = (models) => {
        Genres.belongsTo(models.SongGenres,{foreignKey:'id',as:'songGenres'});
    };


    Genres.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            thumbnail: {
                type: DataTypes.STRING,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
            

        },
        {
            sequelize,
            modelName: 'Genres',
        });
    return Genres;
};
