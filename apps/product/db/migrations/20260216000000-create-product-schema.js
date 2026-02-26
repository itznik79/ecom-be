"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Brands
    await queryInterface.createTable("brands", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      logo_url: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    // Products
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      brand_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      category_id: { type: Sequelize.UUID, allowNull: true },
      description: { type: Sequelize.TEXT },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    // Product variants
    await queryInterface.createTable("product_variants", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      product_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      sku: { type: Sequelize.STRING, allowNull: false },
      current_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      compare_at_price: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    // Attributes
    await queryInterface.createTable("attributes", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      code: { type: Sequelize.STRING, allowNull: false },
      data_type: { type: Sequelize.STRING, allowNull: false },
      is_filterable: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      is_variant_level: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    // Attribute values (no timestamps in model)
    await queryInterface.createTable("attribute_values", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      attribute_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'attributes', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      value_text: { type: Sequelize.STRING(255), allowNull: true },
      value_number: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      sort_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    });

    // Variant attribute values
    await queryInterface.createTable("variant_attribute_values", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      attribute_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'attributes', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      attribute_value_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'attribute_values', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      variant_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'product_variants', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    // Product images
    await queryInterface.createTable("product_images", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      product_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'products', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      variant_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'product_variants', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' },
      url: { type: Sequelize.STRING, allowNull: false },
      alt_text: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    // Category attributes
    await queryInterface.createTable("category_attributes", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      category_id: { type: Sequelize.UUID, allowNull: false },
      attribute_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'attributes', key: 'id' }, onDelete: 'CASCADE', onUpdate: 'CASCADE' },
      is_filterable: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      is_required: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      sort_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("category_attributes");
    await queryInterface.dropTable("product_images");
    await queryInterface.dropTable("variant_attribute_values");
    await queryInterface.dropTable("attribute_values");
    await queryInterface.dropTable("attributes");
    await queryInterface.dropTable("product_variants");
    await queryInterface.dropTable("products");
    await queryInterface.dropTable("brands");
  },
};
