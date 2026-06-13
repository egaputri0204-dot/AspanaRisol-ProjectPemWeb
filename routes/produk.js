const multer = require("multer");
const express = require("express");
const router = express.Router();

const db = require("../config/db");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

// Data Produk
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

    res.render("produk", {
      produk: result,
    });
  });
});

// Form Tambah Produk
router.get("/tambah", (req, res) => {
  db.query("SELECT * FROM kategori", (err, kategori) => {
    if (err) {
      return res.send(err);
    }

    res.render("tambahProduk", {
      kategori: kategori,
    });
  });
});

// Simpan Produk
router.post("/tambah", upload.single("gambar"), (req, res) => {
  const { nama_produk, deskripsi, harga, kategori_id } = req.body;

  const gambar = req.file ? req.file.filename : null;

  db.query(
    `INSERT INTO produk
      (nama_produk, deskripsi, harga, gambar, kategori_id)
      VALUES (?, ?, ?, ?, ?)`,
    [nama_produk, deskripsi, harga, gambar, kategori_id],
    (err) => {
      if (err) {
        return res.send(err);
      }

      res.redirect("/produk");
    },
  );
});

module.exports = router;
