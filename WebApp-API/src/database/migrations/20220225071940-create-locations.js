'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Locations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            street:{
                type:Sequelize.STRING
            },
            city:{
                type: Sequelize.STRING,
                
            },
            state: {
                type: Sequelize.STRING,
                
            },
            zipcode:{
                type:Sequelize.INTEGER,
            },
            country:{
                type:Sequelize.STRING
            },
            latitude:{
                type:Sequelize.FLOAT
            },
            longitude:{
                type:Sequelize.FLOAT
            },
            userId:{
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
    async down(queryInterface,) {
        await queryInterface.dropTable('Locations');
    }
};