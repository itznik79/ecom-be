'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Check if the 'provider' column exists and modify it, or handle ENUM creation
        // Since Sequelize ENUMs can be dialect specific (Postgres uses custom types), 
        // we generally change the column definition.

        // Note: SQLite doesn't support ENUMs natively, it treats them as TEXT with Check constraints or just TEXT.
        // Postgres supports ENUM types.

        // For safety and cross-DB compatibility in this existing setup, we'll try to change column.
        // Ideally, we might need to cast existing values if they were incompatible, but 'local', 'google', 'github' are strings.

        await queryInterface.changeColumn('user_credentials', 'provider', {
            type: Sequelize.ENUM('local', 'google', 'github'),
            allowNull: false
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert back to String
        await queryInterface.changeColumn('user_credentials', 'provider', {
            type: Sequelize.STRING,
            allowNull: false
        });
    }
};
