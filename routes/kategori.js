const express = require("express");
const router = express.Router();

const cekLogin = require("../middleware/auth");
const db = require("../config/db");

// Tampil data kategori
router.get("/", cekLogin, (req, res) => {
  if (!process.env.DB_HOST || !process.env.DB_NAME) {
    return res.render("kategori", {
      kategori: [],
    });
  }

  db.query("SELECT * FROM kategori", (err, result) => {
    if (err) {
      return res.send(err);
    }

    res.render("kategori", {
      kategori: result,
    });
  });
});

// Form tambah kategori
router.get("/tambah", cekLogin, (req, res) => {
  res.render("tambahKategori");
});

// Simpan kategori
router.post("/tambah", cekLogin, (req, res) => {
  const nama_kategori = req.body.nama_kategori;

  db.query(
    "INSERT INTO kategori (nama_kategori) VALUES (?)",
    [nama_kategori],
    (err) => {
      if (err) {
        return res.send(err);
      }

      res.redirect("/kategori");
    },
  );
});

// Form Edit
router.get("/edit/:id", cekLogin, (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM kategori WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.send(err);
    }

    res.render("editKategori", {
      kategori: result[0],
    });
  });
});

// Proses Update
router.post("/edit/:id", cekLogin, (req, res) => {
  const id = req.params.id;
  const nama_kategori = req.body.nama_kategori;

  db.query(
    "UPDATE kategori SET nama_kategori = ? WHERE id = ?",
    [nama_kategori, id],
    (err) => {
      if (err) {
        return res.send(err);
      }

      res.redirect("/kategori");
    },
  );
});

// Hapus kategori
router.get("/hapus/:id", cekLogin, (req, res) => {
  const id = req.params.id;

  // cek apakah kategori masih dipakai produk
  db.query(
    "SELECT * FROM produk WHERE kategori_id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.send(err);
      }

      if (result.length > 0) {
        return res.send(`
          <script>
          alert('Kategori tidak bisa dihapus karena masih digunakan oleh produk!');
          window.location='/kategori';
          </script>
          `);
      }

      db.query("DELETE FROM kategori WHERE id = ?", [id], (err) => {
        if (err) {
          return res.send(err);
        }

        res.redirect("/kategori");
      });
    },
  );
});

module.exports = router;
