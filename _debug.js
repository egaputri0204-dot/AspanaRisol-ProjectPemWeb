const p = require('serverless-http/package.json');
console.log('serverless-http version:', p.version);

// Test if the app can be required
const app = require('./app');
console.log('App loaded successfully');

// Test if db module works
const db = require('./config/db');
console.log('DB module loaded, status:', db.isConnected ? db.isConnected() : 'N/A');
console.log('VERCEL env:', process.env.VERCEL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', process.env.DB_HOST);
