'use strict';
module.exports = { async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Albums', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING
        },
        thumbnail: {
            type: Sequelize.STRING
        },
        live:{
            type:Sequelize.BOOLEAN,
            defaultValue:false
        },
        bandId: {
            type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Albums');
}
};