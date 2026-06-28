const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("HOME");
});

app.get("/ping", (req, res) => {
  res.send("PONG");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
