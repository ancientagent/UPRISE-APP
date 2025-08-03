'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SongSkips extends Model {}
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
  
    SongSkips.init({
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
        skipTime: {
            type: DataTypes.FLOAT,
            allowNull: false,
            comment: 'Time in seconds when song was skipped'
        },
        songDuration: {
            type: DataTypes.FLOAT,
            allowNull: false,
            comment: 'Total duration of the song in seconds'
        },
        skipPercentage: {
            type: DataTypes.FLOAT,
            allowNull: false,
            comment: 'Percentage of song completed before skip'
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
        modelName: 'SongSkips',
        indexes: [
            {
                fields: ['songId', 'tier'],
                name: 'song_tier_skips_index'
            },
            {
                fields: ['userId', 'tier'],
                name: 'user_tier_skips_index'
            },
            {
                fields: ['skipPercentage'],
                name: 'skip_percentage_index'
            }
        ]
    });
    return SongSkips;
}; 