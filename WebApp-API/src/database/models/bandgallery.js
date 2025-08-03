'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BandGallery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        // static associate(models) {
        // // define association here
        // }
    }
    BandGallery.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        bandId: {
            type: DataTypes.STRING
        },
        mediaURL:{
            type: DataTypes.STRING
        },
        mediaType:{
            type: DataTypes.STRING
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
        modelName: 'BandGallery',
    });
    return BandGallery;
};