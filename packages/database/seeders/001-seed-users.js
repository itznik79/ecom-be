'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [
      {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        email: 'admin@example.com',
        password: '$2a$10$dXJ3U6/tOmc5Sut7VqHXG.k7tIQNlwf3YP2LW7VdmE5bV6Cm0KZQK', // password: admin123
        name: 'Admin User',
        phone: '+1234567890',
        avatar: null,
        is_email_verified: true,
        is_active: true,
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'b2c3d4e5-f6a7-8901-bcde-f123456789ab',
        email: 'test@example.com',
        password: '$2a$10$dXJ3U6/tOmc5Sut7VqHXG.k7tIQNlwf3YP2LW7VdmE5bV6Cm0KZQK', // password: admin123
        name: 'Test User',
        phone: '+0987654321',
        avatar: null,
        is_email_verified: true,
        is_active: true,
        last_login: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
