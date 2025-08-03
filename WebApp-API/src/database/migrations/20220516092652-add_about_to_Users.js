'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        await queryInterface.addColumn('Users', 'about', { type: Sequelize.STRING});
        await queryInterface.addColumn('Users', 'facebook', { type: Sequelize.STRING});
        await queryInterface.addColumn('Users', 'instagram', { type: Sequelize.STRING});
        await queryInterface.addColumn('Users', 'twitter', { type: Sequelize.STRING});
    },

    async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        await queryInterface.removeColumn('Users', 'about');
        await queryInterface.removeColumn('Users', 'facebook');
        await queryInterface.removeColumn('Users', 'instagram');
        await queryInterface.removeColumn('Users', 'twitter');
    }
};
