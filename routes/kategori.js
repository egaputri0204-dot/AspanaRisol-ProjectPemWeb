const express = require("express");
const router = express.Router();

const db = require("../config/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM kategori", (err, result) => {
    if (err) {
      return res.send(err);
    }

    res.render("kategori", {
      kategori: result,
    });
  });
});

module.exports = router;
