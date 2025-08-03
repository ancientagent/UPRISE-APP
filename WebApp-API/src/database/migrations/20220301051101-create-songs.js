'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Songs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING
            },
            song:{
                type:Sequelize.STRING
            },
            thumbnail:{
                type:Sequelize.STRING
            },
            duration:{
                type:Sequelize.FLOAT
            },
            cityName:{
                type:Sequelize.STRING
            },
            stateName:{
                type:Sequelize.STRING
            }, 
            uploadedBy:{
                type:Sequelize.INTEGER
            },
            bandId:{
                type:Sequelize.INTEGER
            },
            live:{
                type:Sequelize.BOOLEAN,
                defaultValue:false
            },
            albumId:{
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
        await queryInterface.dropTable('Songs');
    }
};