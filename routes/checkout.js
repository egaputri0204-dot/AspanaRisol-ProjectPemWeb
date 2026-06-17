const express = require("express");
const router = express.Router();

const db = require("../config/db");

// Halaman Checkout
router.get("/", (req, res) => {
  res.render("checkout");
});

// Simpan Checkout
router.post("/", (req, res) => {
  const { nama_pembeli, no_hp, alamat, cart } = req.body;

  const cartItems = JSON.parse(cart);

  console.log("Isi Cart:");
  console.log(cartItems);

  let total = 0;

  cartItems.forEach((item) => {
    const harga = Number(item.price.replace(/[^0-9]/g, ""));

    total += harga * item.qty;
  });

  db.query(
    `INSERT INTO pesanan
    (nama_pembeli, no_hp, alamat, total, status)
    VALUES (?, ?, ?, ?, ?)`,
    [nama_pembeli, no_hp, alamat, total, "Pending"],
    (err, result) => {
      if (err) {
        return res.send(err);
      }

      const pesananId = result.insertId;

      let selesai = 0;

      cartItems.forEach((item) => {
        db.query(
          `SELECT id
          FROM produk
          WHERE id = ?`,
          [item.id],
          (err, produkResult) => {
            if (err) {
              return res.send(err);
            }

            if (produkResult.length === 0) {
              return res.send(
                "Produk tidak ditemukan. Kosongkan cart lalu tambah produk kembali.",
              );
            }

            const produkId = produkResult[0].id;

            db.query(
              `INSERT INTO detail_pesanan
              (pesanan_id, produk_id, jumlah)
              VALUES (?, ?, ?)`,
              [pesananId, produkId, item.qty],
              (err) => {
                if (err) {
                  return res.send(err);
                }

                selesai++;

                if (selesai === cartItems.length) {
                  res.send(`
                    <script>
                      localStorage.removeItem('cart');

                      alert('Pesanan berhasil dibuat');

                      window.location='/';
                    </script>
                  `);
                }
              },
            );
          },
        );
      });
    },
  );
});

module.exports = router;
