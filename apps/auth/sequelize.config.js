require('ts-node/register');
const path = require('path');

// Load environment variables from the root .env file
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

module.exports = {
    development: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.AUTH_DB_NAME || 'auth_db',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5436'),
        dialect: 'postgres',
    },
    test: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.AUTH_DB_NAME_TEST || 'auth_db_test',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5436'),
        dialect: 'postgres',
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.AUTH_DB_NAME,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        dialect: 'postgres',
    },
};
