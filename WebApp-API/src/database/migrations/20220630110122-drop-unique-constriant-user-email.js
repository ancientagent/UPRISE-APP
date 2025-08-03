'use strict';

module.exports = {
    async up (queryInterface) {
        try {
            await queryInterface.removeConstraint('Users', 'Users_email_key');
        } catch (error) {
            console.log('ignoring unique on email');
        }
    },

    async down () {
    }
};
