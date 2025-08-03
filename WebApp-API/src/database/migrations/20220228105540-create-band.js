'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Bands', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING
            },
            description:{
                type: Sequelize.STRING
            },
            logo:{
                type:Sequelize.STRING
            },
            facebook:{
                type:Sequelize.STRING
            },
            instagram:{
                type:Sequelize.STRING
            },
            youtube:{
                type:Sequelize.STRING
            },
            twitter:{
                type:Sequelize.STRING
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
        await queryInterface.dropTable('Bands');
    }
};