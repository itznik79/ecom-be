require('dotenv').config({ path: './.env' });
const Sentry = require('@sentry/node');

const dsn = process.env.SENTRY_DSN;
if (!dsn) {
  console.error('SENTRY_DSN missing in .env');
  process.exit(1);
}

Sentry.init({
  dsn,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
});

console.log('Sending test message to Sentry...');
Sentry.captureMessage('Test event from local repo — monitoring verification');

Sentry.flush(5000).then(() => {
  console.log('Flushed to Sentry, exiting.');
  process.exit(0);
});
