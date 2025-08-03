'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Bands', 'cityName', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'title'
    });

    await queryInterface.addColumn('Bands', 'stateName', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'cityName'
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('Bands', ['cityName', 'stateName'], {
      name: 'bands_location_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Bands', 'bands_location_index');
    await queryInterface.removeColumn('Bands', 'stateName');
    await queryInterface.removeColumn('Bands', 'cityName');
  }
}; 