const express = require("express");
const router = express.Router();

const db = require("../config/db");

router.get("/", (req, res) => {
  const isVercel = !!process.env.VERCEL;
  const useDb = db.canUseDatabase();

  if (!useDb) {
    return res.render("home", {
      produk: [],
      user: req.session.user || null,
      message: null,
    });
  }

  const sql = `
    SELECT produk.*, kategori.nama_kategori
    FROM produk
    LEFT JOIN kategori
    ON produk.kategori_id = kategori.id
    WHERE produk.status = 'Aktif'
`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Home route DB error:", err.message);
      return res.render("home", {
        produk: [],
        user: req.session.user || null,
        message: "Database belum tersedia.",
      });
    }

    res.render("home", {
      produk: result || [],
      user: req.session.user || null,
      message: null,
    });
  });
});

module.exports = router;
