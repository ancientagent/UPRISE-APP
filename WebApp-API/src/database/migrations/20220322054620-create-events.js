'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Events', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            thumbnail:{
                type:Sequelize.STRING
            },
            eventName: {
                type:Sequelize.STRING
            },
            description:{
                type: Sequelize.STRING
            },
            startTime:{
                type:Sequelize.DATE
            }, 
            endTime:{
                type:Sequelize.DATE
            },
            latitude:{
                type:Sequelize.FLOAT
            },
            longitude:{
                type:Sequelize.FLOAT
            },
            location:{
                type:Sequelize.STRING
            },
            bandId:{
                type:Sequelize.INTEGER
            },
            createdBy:{
                type:Sequelize.INTEGER
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
        await queryInterface.dropTable('Events');
    }
};