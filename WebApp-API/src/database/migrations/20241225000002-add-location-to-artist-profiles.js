'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('ArtistProfiles', 'cityName', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'title'
    });

    await queryInterface.addColumn('ArtistProfiles', 'stateName', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'cityName'
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('ArtistProfiles', ['cityName', 'stateName'], {
      name: 'artist_profiles_location_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('ArtistProfiles', 'artist_profiles_location_index');
    await queryInterface.removeColumn('ArtistProfiles', 'stateName');
    await queryInterface.removeColumn('ArtistProfiles', 'cityName');
  }
}; 