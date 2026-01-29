'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('categories', [
      {
        id: 'c3d4e5f6-a7b8-9012-cdef-1234567890ab',
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        slug: 'electronics',
        icon: 'icon-electronics',
        parent_id: null,
        is_active: true,
        display_order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'd4e5f6a7-b8c9-0123-def1-234567890abc',
        name: 'Laptops',
        description: 'Laptop computers and notebooks',
        slug: 'laptops',
        icon: 'icon-laptop',
        parent_id: 'c3d4e5f6-a7b8-9012-cdef-1234567890ab',
        is_active: true,
        display_order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'e5f6a7b8-c9d0-1234-ef12-34567890abcd',
        name: 'Clothing',
        description: 'Apparel and fashion items',
        slug: 'clothing',
        icon: 'icon-clothing',
        parent_id: null,
        is_active: true,
        display_order: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'f6a7b8c9-d0e1-2345-f123-4567890abcde',
        name: 'Books',
        description: 'Books and educational materials',
        slug: 'books',
        icon: 'icon-book',
        parent_id: null,
        is_active: true,
        display_order: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('categories', null, {});
  },
};
