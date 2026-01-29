"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
exports.rollbackMigrations = rollbackMigrations;
const sequelize_typescript_1 = require("sequelize-typescript");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('DatabaseMigration');
async function runMigrations(sequelize) {
    try {
        logger.log('Starting database migrations...');
        // Get migration files
        const migrationsPath = path.join(__dirname, '../../migrations');
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
            const [executed] = await sequelize.query(`SELECT * FROM sequelize_meta WHERE name = '${file}'`);
            if (executed.length === 0) {
                logger.log(`Running migration: ${file}`);
                const migration = require(path.join(migrationsPath, file));
                await migration.up(sequelize.getQueryInterface(), sequelize_typescript_1.Sequelize);
                await sequelize.query(`INSERT INTO sequelize_meta (name) VALUES ('${file}')`);
                logger.log(`✓ Migration completed: ${file}`);
            }
            else {
                logger.debug(`✓ Already executed: ${file}`);
            }
        }
        logger.log('All migrations completed successfully!');
    }
    catch (error) {
        logger.error('Migration failed:', error);
        throw error;
    }
}
async function rollbackMigrations(sequelize) {
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
            await migration.down(sequelize.getQueryInterface(), sequelize_typescript_1.Sequelize);
            await sequelize.query(`DELETE FROM sequelize_meta WHERE name = '${file}'`);
            logger.log(`✓ Rollback completed: ${file}`);
        }
        logger.log('All rollbacks completed successfully!');
    }
    catch (error) {
        logger.error('Rollback failed:', error);
        throw error;
    }
}
//# sourceMappingURL=migrations.js.map