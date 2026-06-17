const multer = require("multer");
const express = require("express");
const router = express.Router();

const cekLogin = require("../middleware/auth");
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
router.get("/", cekLogin, (req, res) => {
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
router.get("/tambah", cekLogin, (req, res) => {
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
router.post("/tambah", cekLogin, upload.single("gambar"), (req, res) => {
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

// Form Edit Produk
router.get("/edit/:id", cekLogin, (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM produk WHERE id = ?", [id], (err, produkResult) => {
    if (err) {
      return res.send(err);
    }

    db.query("SELECT * FROM kategori", (err, kategoriResult) => {
      if (err) {
        return res.send(err);
      }

      res.render("editProduk", {
        produk: produkResult[0],
        kategori: kategoriResult,
      });
    });
  });
});

// Proses Update Produk
router.post("/edit/:id", cekLogin, upload.single("gambar"), (req, res) => {
  const id = req.params.id;

  const { nama_produk, deskripsi, harga, kategori_id } = req.body;

  db.query("SELECT gambar FROM produk WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.send(err);
    }

    let gambar = result[0].gambar;

    if (req.file) {
      gambar = req.file.filename;
    }

    db.query(
      `UPDATE produk
         SET nama_produk = ?,
             deskripsi = ?,
             harga = ?,
             kategori_id = ?,
             gambar = ?
         WHERE id = ?`,
      [nama_produk, deskripsi, harga, kategori_id, gambar, id],
      (err) => {
        if (err) {
          return res.send(err);
        }

        res.redirect("/produk");
      },
    );
  });
});

// Nonaktifkan Produk
router.get("/nonaktif/:id", cekLogin, (req, res) => {
  const id = req.params.id;

  db.query(
    "UPDATE produk SET status = 'Nonaktif' WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        return res.send(err);
      }

      res.redirect("/produk");
    },
  );
});

// Aktifkan Produk
router.get("/aktifkan/:id", cekLogin, (req, res) => {
  const id = req.params.id;

  db.query("UPDATE produk SET status = 'Aktif' WHERE id = ?", [id], (err) => {
    if (err) {
      return res.send(err);
    }

    res.redirect("/produk");
  });
});

module.exports = router;
