'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SongLikes extends Model {}
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
  
    SongLikes.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        songId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tier: {
            type: DataTypes.ENUM,
            values: ['CITYWIDE', 'STATEWIDE', 'NATIONAL'],
            allowNull: false,
            defaultValue: 'CITYWIDE'
        },
        status: {
            type: DataTypes.ENUM,
            values: ['LIKE', 'NEUTRAL', 'DISLIKE'],
            allowNull: false,
            defaultValue: 'NEUTRAL'
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
        modelName: 'SongLikes',
        indexes: [
            {
                unique: true,
                fields: ['userId', 'songId', 'tier'],
                name: 'unique_user_song_tier_like'
            },
            {
                fields: ['songId', 'tier'],
                name: 'song_tier_likes_index'
            },
            {
                fields: ['userId', 'tier'],
                name: 'user_tier_likes_index'
            }
        ]
    });
    return SongLikes;
}; 