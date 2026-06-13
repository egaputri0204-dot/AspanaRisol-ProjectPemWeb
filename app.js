const express = require("express");
const db = require("./config/db");

const kategoriRoutes = require("./routes/kategori");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/kategori", kategoriRoutes);

app.get("/", (req, res) => {
  res.send("Aspana Risol Express Berjalan");
});

app.get("/test-db", (req, res) => {
  db.query("SELECT * FROM kategori", (err, result) => {
    if (err) {
      return res.send(err);
    }

    res.json(result);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
