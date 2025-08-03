'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Votes', 'tier', {
      type: Sequelize.ENUM('CITYWIDE', 'STATEWIDE', 'NATIONAL'),
      allowNull: false,
      defaultValue: 'CITYWIDE'
    });
    
    // Add location column as well since it's in the model
    await queryInterface.addColumn('Votes', 'location', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'GPS coordinates and location data for verification'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Votes', 'tier');
    await queryInterface.removeColumn('Votes', 'location');
  }
};
