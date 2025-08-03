'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SongPriority extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SongPriority.belongsTo(models.Songs, { foreignKey: 'songId', as: 'song' });
    }
  }
  SongPriority.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    songId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Songs',
            key: 'id'
        }
    },
    tier: {
        type: DataTypes.ENUM,
        values: ['CITYWIDE', 'STATEWIDE', 'NATIONAL'],
        allowNull: false,
        defaultValue: 'CITYWIDE'
    },
    timeBasedPriority: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0
    },
    communityPriority: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    finalPriority: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    communityThresholdReached: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    totalUsersHeard: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    requiredUsersThreshold: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastCalculated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'SongPriority',
    tableName: 'SongPriority'
  });
  return SongPriority;
};