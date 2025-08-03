'use strict';
module.exports = { async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BandInvitations', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        email: {
            type: Sequelize.STRING
        },
        bandId: {
            type: Sequelize.INTEGER
        },
        invitationToken: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM,
            values: ['ACCEPTED', 'REJECTED', 'CANCELLED','PENDING'],
            defaultValue:'PENDING'
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
    await queryInterface.dropTable('BandInvitations');
}
};