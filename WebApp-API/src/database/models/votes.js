'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Votes extends Model {}
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
  
    Votes.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        userId: DataTypes.INTEGER,
        songId: DataTypes.INTEGER,
        type:{
            type: DataTypes.ENUM,
            values: ['UPVOTE','DOWNVOTE']
        },
        tier: {
            type: DataTypes.ENUM,
            values: ['CITYWIDE', 'STATEWIDE', 'NATIONAL'],
            allowNull: false,
            defaultValue: 'CITYWIDE'
        },
        location: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'GPS coordinates and location data for verification'
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
        modelName: 'Votes',
        indexes: [
            {
                unique: true,
                fields: ['userId', 'songId', 'tier'],
                name: 'unique_user_song_tier_vote'
            },
            {
                fields: ['songId', 'tier'],
                name: 'song_tier_votes_index'
            },
            {
                fields: ['userId', 'tier'],
                name: 'user_tier_votes_index'
            }
        ]
    });
    return Votes;
};