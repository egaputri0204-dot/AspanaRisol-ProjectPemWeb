// api/index.js – Vercel serverless entry point
const serverless = require('serverless-http');
const app = require('../app'); // app.js exports the Express app
module.exports = serverless(app);
