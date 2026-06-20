const express = require("express");
const router = express.Router();

const db = require("../config/db");
const userAuth = require("../middleware/userAuth");

const multer = require("multer");

// Konfigurasi upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/bukti-transfer");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File harus JPG atau PNG"));
    }
  },
});

// Upload Bukti Transfer
router.post(
  "/upload-bukti/:id",
  userAuth,
  upload.single("bukti"),
  (req, res) => {
    const id = req.params.id;

    if (!req.file) {
      return res.send("File tidak ditemukan");
    }

    db.query(
      `
      UPDATE pesanan
      SET bukti_pembayaran = ?
      WHERE id = ? AND user_id = ?
      `,
      [req.file.filename, id, req.session.user.id],
      (err) => {
        if (err) {
          return res.send(err);
        }

        res.send(`
          <script>
            alert('Bukti pembayaran berhasil diupload');
            window.location='/pesanan-detail/${id}';
          </script>
        `);
      },
    );
  },
);

module.exports = router;
