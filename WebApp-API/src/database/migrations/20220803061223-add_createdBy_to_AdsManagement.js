'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        await queryInterface.addColumn('AdsManagements', 'bandId', {type:Sequelize.INTEGER});
        await queryInterface.addColumn('AdsManagements', 'createdBy', {type:Sequelize.INTEGER});
    },

    async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        await queryInterface.removeColumn('AdsManagements', 'bandId');
        await queryInterface.removeColumn('AdsManagements', 'createdBy');
    }
};
