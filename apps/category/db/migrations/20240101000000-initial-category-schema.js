'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('categories', {
            id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
            parent_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'categories', key: 'id' }, onDelete: 'SET NULL' },
            name: { type: Sequelize.STRING, allowNull: false },
            slug: { type: Sequelize.STRING, allowNull: false, unique: true },
            description: { type: Sequelize.STRING },
            is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
            created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
            updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('categories');
    }
};
