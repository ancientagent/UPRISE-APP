'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        await queryInterface.addColumn('Songs', 'promotedSong',{type: Sequelize.ENUM, values: ['CITY', 'STATE', 'NATIONAL'],defaultValue:'CITY'});
    },

    async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        await queryInterface.removeColumn('Songs', 'promotedSong');
    }
};
