'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Songs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Songs.hasMany(models.SongGenres, { foreignKey: 'songId', as: 'genres' });
      Songs.belongsTo(models.Band, { foreignKey: 'bandId', as: 'band' });
      Songs.hasMany(models.SongPriority, { foreignKey: 'songId', as: 'priority' });
    }
  }
  Songs.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: DataTypes.STRING,
    song: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    duration: DataTypes.FLOAT,
    cityName: DataTypes.STRING,
    stateName: DataTypes.STRING,
    country: DataTypes.STRING,
    uploadedBy: DataTypes.INTEGER,
    live: DataTypes.BOOLEAN,
    bandId: DataTypes.INTEGER,
    albumId: DataTypes.INTEGER,
    deletedAt: DataTypes.DATE,
    hashValue: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    promotedSong: {
      type: DataTypes.ENUM,
      values: ['NONE', 'CITY', 'STATE', 'NATIONAL'],
      defaultValue: 'NONE'
    },
    airedOn: DataTypes.DATE,
    promotedToStateDate: DataTypes.DATE,
    promotedToNationalDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Songs',
    paranoid: true,
  });
  return Songs;
};