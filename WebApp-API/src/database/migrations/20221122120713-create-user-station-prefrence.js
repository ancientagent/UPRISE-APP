'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('UserStationPrefrences', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER
            },
            stationPrefrence:{
                type: Sequelize.STRING
            },
            stationType: {
                type:Sequelize.ENUM,
                values:['1','2','3'], // 1.City 2.State 3.National
                defaultValue:'1'
            },
            active: {
                type:Sequelize.BOOLEAN
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
    async down(queryInterface) {
        await queryInterface.dropTable('UserStationPrefrences');
    }
};