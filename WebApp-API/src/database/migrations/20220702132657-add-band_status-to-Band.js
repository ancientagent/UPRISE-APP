'use strict';

module.exports = {
    async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        await queryInterface.addColumn('Bands', 'status',{type: Sequelize.ENUM,
            values: ['ACTIVE','INACTIVE','BLOCKED'],
            defaultValue:'ACTIVE'
        });
    },

    async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        await queryInterface.removeColumn('Bands', 'status');  
    }
};
