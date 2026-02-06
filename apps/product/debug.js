const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, '../../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env:', result.error);
} else {
    console.log('.env loaded successfully');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log('PRODUCT_DB_NAME:', process.env.PRODUCT_DB_NAME);
    console.log('NODE_ENV:', process.env.NODE_ENV);
}
