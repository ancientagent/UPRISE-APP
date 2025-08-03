'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        await queryInterface.addColumn('Events', 'cityName', {type:Sequelize.STRING});
        await queryInterface.addColumn('Events', 'stateName', {type:Sequelize.STRING});
        await queryInterface.addColumn('Events', 'country', {type:Sequelize.STRING});
    },

    async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        await queryInterface.removeColumn('Events', 'cityName');
        await queryInterface.removeColumn('Events', 'stateName');
        await queryInterface.removeColumn('Events', 'country');
    }
};
