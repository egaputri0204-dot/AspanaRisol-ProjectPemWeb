const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("HOME");
});

app.get("/ping", (req, res) => {
  res.send("PONG");
});

module.exports = app;
