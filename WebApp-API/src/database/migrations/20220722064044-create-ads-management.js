'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('AdsManagements', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            banner:{
                type:Sequelize.STRING
            },
            title: {
                type: Sequelize.STRING
            },
            description:{
                type : Sequelize.STRING
            },
            link:{
                type : Sequelize.STRING
            },
            live:{
                type:Sequelize.BOOLEAN,
                defaultValue:false
            },
            thumbnail:{
                type:Sequelize.STRING
            },
            city:{
                type : Sequelize.STRING
            },
            state:{
                type : Sequelize.STRING
            },
            country:{
                type : Sequelize.STRING
            },
            latitude:{
                type:Sequelize.FLOAT
            },
            longitude:{
                type:Sequelize.FLOAT
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
        await queryInterface.dropTable('AdsManagements');
    }
};