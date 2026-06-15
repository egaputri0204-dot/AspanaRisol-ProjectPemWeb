const express = require("express");
const router = express.Router();

const db = require("../config/db");

router.get("/", (req, res) => {
  const sql = `
    SELECT produk.*, kategori.nama_kategori
    FROM produk
    LEFT JOIN kategori
    ON produk.kategori_id = kategori.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.send(err);
    }

    res.render("home", {
      produk: result,
    });
  });
});

module.exports = router;
