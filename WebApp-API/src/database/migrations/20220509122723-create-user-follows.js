'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('UserFollows', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            followerId: {
                type: Sequelize.INTEGER
            },
            followeeId: Sequelize.INTEGER,
            status: {
                type: Sequelize.ENUM,
                values: ['ACCEPTED', 'REJECTED', 'CANCELLED','PENDING'],
                defaultValue:'ACCEPTED'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, ) {
        await queryInterface.dropTable('UserFollows');
    }
};