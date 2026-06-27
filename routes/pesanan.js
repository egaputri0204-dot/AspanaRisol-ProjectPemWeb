const express = require("express");
const router = express.Router();

const cekLogin = require("../middleware/auth");
const db = require("../config/db");

router.get("/", cekLogin, (req, res) => {
  const status = req.query.status || "";

  let sql = `
    SELECT *
    FROM pesanan
  `;

  let params = [];

  if (status) {
    sql += `
      WHERE status_pembayaran = ?
    `;
    params.push(status);
  }

  sql += `
    ORDER BY id DESC
  `;

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.send(err);
    }

    const totalPesanan = result.length;

    const totalPendapatan = result.reduce(
      (total, item) => total + Number(item.total),
      0,
    );

    res.render("pesanan", {
      pesanan: result,
      totalPesanan,
      totalPendapatan,
      status,
    });
  });
});

// Detail Pesanan
router.get("/detail/:id", cekLogin, (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM pesanan WHERE id = ?", [id], (err, pesanan) => {
    if (err) {
      return res.send(err);
    }

    const sql = `
        SELECT
          detail_pesanan.*,
          produk.nama_produk,
          produk.harga
        FROM detail_pesanan
        JOIN produk
          ON detail_pesanan.produk_id = produk.id
        WHERE detail_pesanan.pesanan_id = ?
      `;

    db.query(sql, [id], (err, detail) => {
      if (err) {
        return res.send(err);
      }

      res.render("detailPesanan", {
        detail,
        pesanan: pesanan[0],
        pesanan_id: id,
      });
    });
  });
});

// Update Status Pesanan
router.get("/status/:id", cekLogin, (req, res) => {
  const id = req.params.id;

  console.log("ID yang diterima:", id);

  db.query("SELECT status FROM pesanan WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.send(err);
    }

    console.log("Hasil query:", result);

    if (result.length === 0) {
      return res.send("Data tidak ditemukan");
    }

    let statusBaru = "Pending";

    if (result[0].status === "Pending") {
      statusBaru = "Diproses";
    } else if (result[0].status === "Diproses") {
      statusBaru = "Selesai";
    }

    db.query(
      "UPDATE pesanan SET status = ? WHERE id = ?",
      [statusBaru, id],
      (err) => {
        if (err) {
          return res.send(err);
        }

        res.send(statusBaru);
      },
    );
  });
});

// Verifikasi Pembayaran
router.get("/verifikasi/:id", cekLogin, (req, res) => {
  const id = req.params.id;

  db.query(
    `
    UPDATE pesanan
    SET status_pembayaran='Lunas'
    WHERE id=?
    `,
    [id],
    (err) => {
      if (err) {
        return res.send(err);
      }

      res.redirect("/pesanan/detail/" + id);
    },
  );
});

module.exports = router;
