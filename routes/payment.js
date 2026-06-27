const express = require("express");
const router = express.Router();

const db = require("../config/db");
const userAuth = require("../middleware/userAuth");
const { upload, getFileUrl } = require("../config/upload");

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

    const bukti = getFileUrl(req.file);

    db.query(
      `UPDATE pesanan
       SET bukti_pembayaran = ?
       WHERE id = ? AND user_id = ?`,
      [bukti, id, req.session.user.id],
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
