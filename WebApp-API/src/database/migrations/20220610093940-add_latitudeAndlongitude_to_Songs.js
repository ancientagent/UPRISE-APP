'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        await queryInterface.addColumn('Songs', 'latitude', {type:Sequelize.FLOAT});
        await queryInterface.addColumn('Songs', 'longitude', {type:Sequelize.FLOAT});
    },

    async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        await queryInterface.removeColumn('Songs', 'latitude');
        await queryInterface.removeColumn('Songs', 'longitude');
    }
};
