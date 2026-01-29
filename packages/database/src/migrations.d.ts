import { Sequelize } from 'sequelize-typescript';
export declare function runMigrations(sequelize: Sequelize): Promise<void>;
export declare function rollbackMigrations(sequelize: Sequelize): Promise<void>;
