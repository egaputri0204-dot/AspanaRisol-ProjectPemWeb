const serverless = require("serverless-http");
const app = require("../app");

module.exports = serverless(app, {
  binary: ["image/*", "application/octet-stream"],
  provider: "vercel",
});
