'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Users
        await queryInterface.createTable('users', {
            id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
            email: { type: Sequelize.STRING, unique: true, allowNull: false },
            provider: { type: Sequelize.STRING, allowNull: false },
            provider_id: { type: Sequelize.STRING, allowNull: true },
            is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
            created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
            updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
        });

        // Roles
        await queryInterface.createTable('roles', {
            id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
            name: { type: Sequelize.STRING, unique: true, allowNull: false },
            description: { type: Sequelize.STRING },
            created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
            updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
        });

        // Permissions
        await queryInterface.createTable('permissions', {
            id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
            key: { type: Sequelize.STRING, unique: true, allowNull: false },
            description: { type: Sequelize.STRING },
            created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
            updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
        });

        // UserProfiles
        await queryInterface.createTable('user_profiles', {
            id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
            user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
            first_name: { type: Sequelize.STRING },
            last_name: { type: Sequelize.STRING },
            phone: { type: Sequelize.STRING },
            avatar_url: { type: Sequelize.STRING },
            dob: { type: Sequelize.DATE },
            created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
            updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
        });

        // UserAddresses
        await queryInterface.createTable('user_addresses', {
            id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true, allowNull: false },
            user_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
            type: { type: Sequelize.STRING },
            address_line1: { type: Sequelize.STRING },
            address_line2: { type: Sequelize.STRING },
            city: { type: Sequelize.STRING },
            state: { type: Sequelize.STRING },
            country: { type: Sequelize.STRING },
            postal_code: { type: Sequelize.STRING },
            is_default: { type: Sequelize.BOOLEAN, defaultValue: false },
            created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
            updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
        });

        // UserRoles
        await queryInterface.createTable('user_roles', {
            user_id: { type: Sequelize.UUID, primaryKey: true, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
            role_id: { type: Sequelize.UUID, primaryKey: true, references: { model: 'roles', key: 'id' }, onDelete: 'CASCADE' },
            assigned_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
            created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
            updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
        });

        // RolePermissions
        await queryInterface.createTable('role_permissions', {
            role_id: { type: Sequelize.UUID, primaryKey: true, references: { model: 'roles', key: 'id' }, onDelete: 'CASCADE' },
            permission_id: { type: Sequelize.UUID, primaryKey: true, references: { model: 'permissions', key: 'id' }, onDelete: 'CASCADE' }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('role_permissions');
        await queryInterface.dropTable('user_roles');
        await queryInterface.dropTable('user_addresses');
        await queryInterface.dropTable('user_profiles');
        await queryInterface.dropTable('permissions');
        await queryInterface.dropTable('roles');
        await queryInterface.dropTable('users');
    }
};
