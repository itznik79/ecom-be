import { Sequelize } from 'sequelize-typescript';
import { Logger } from '@nestjs/common';
import { User, Category, AuthSession } from './entities';

const logger = new Logger('SequelizeConfig');

export const sequelizeConfig = {
  dialect: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'ecommerce',
  models: [User, Category, AuthSession],
  autoLoadModels: true,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development' ? (msg: string) => logger.debug(msg) : false,
  timezone: '+00:00',
  dialectOptions: {
    useUTC: true,
  },
};

export const createSequelizeInstance = () => {
  return new Sequelize(sequelizeConfig);
};
