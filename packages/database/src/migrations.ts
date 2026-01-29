import { Sequelize } from 'sequelize-typescript';
import * as path from 'path';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

const logger = new Logger('DatabaseMigration');

export async function runMigrations(sequelize: Sequelize, migrationsDir?: string) {
  try {
    logger.log('Starting database migrations...');

    // Get migration files
    const migrationsPath = migrationsDir || path.join(__dirname, '../../migrations');
    if (!fs.existsSync(migrationsPath)) {
      logger.warn('Migrations directory not found');
      return;
    }

    const migrationFiles = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith('.js'))
      .sort();

    // Create migrations table if it doesn't exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS sequelize_meta (
        name VARCHAR(255) PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Run each migration
    for (const file of migrationFiles) {
      const [executed] = await sequelize.query(
        `SELECT * FROM sequelize_meta WHERE name = '${file}'`
      );

      if (executed.length === 0) {
        logger.log(`Running migration: ${file}`);
        const migration = require(path.join(migrationsPath, file));
        await migration.up(sequelize.getQueryInterface(), Sequelize);
        await sequelize.query(
          `INSERT INTO sequelize_meta (name) VALUES ('${file}')`
        );
        logger.log(`✓ Migration completed: ${file}`);
      } else {
        logger.debug(`✓ Already executed: ${file}`);
      }
    }

    logger.log('All migrations completed successfully!');
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
}

export async function rollbackMigrations(sequelize: Sequelize) {
  try {
    logger.log('Starting database rollback...');

    const migrationsPath = path.join(__dirname, '../../migrations');
    if (!fs.existsSync(migrationsPath)) {
      logger.warn('Migrations directory not found');
      return;
    }

    const migrationFiles = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith('.js'))
      .sort()
      .reverse();

    for (const file of migrationFiles) {
      logger.log(`Rolling back migration: ${file}`);
      const migration = require(path.join(migrationsPath, file));
      await migration.down(sequelize.getQueryInterface(), Sequelize);
      await sequelize.query(`DELETE FROM sequelize_meta WHERE name = '${file}'`);
      logger.log(`✓ Rollback completed: ${file}`);
    }

    logger.log('All rollbacks completed successfully!');
  } catch (error) {
    logger.error('Rollback failed:', error);
    throw error;
  }
}
