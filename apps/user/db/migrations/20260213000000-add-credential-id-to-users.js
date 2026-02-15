'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'credential_id', {
            type: Sequelize.UUID,
            unique: true,
            allowNull: false,
            after: 'id'
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'credential_id');
    }
};
