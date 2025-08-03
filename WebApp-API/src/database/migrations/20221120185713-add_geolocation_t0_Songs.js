'use strict';

module.exports = {
    async up (queryInterface) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        const query = `alter table "Songs" add column geolocation geography(point); 
     `;
        await queryInterface.sequelize.query(query);
    },

    async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        await queryInterface.removeColumn('Songs', 'geolocation');
    }
};
