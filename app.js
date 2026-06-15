const express = require("express");
const db = require("./config/db");
const session = require("express-session");
const homeRoutes = require("./routes/home");

const kategoriRoutes = require("./routes/kategori");
const produkRoutes = require("./routes/produk");
const pesananRoutes = require("./routes/pesanan");
const checkoutRoutes = require("./routes/checkout");
const authRoutes = require("./routes/auth");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "aspanarisol-secret",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(express.static("public"));

app.use("/", homeRoutes);

app.use("/kategori", kategoriRoutes);
app.use("/produk", produkRoutes);
app.use("/pesanan", pesananRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/", authRoutes);

//app.get("/", (req, res) => {
//  res.redirect("/login");
//});

app.get("/", (req, res) => {
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

app.get("/dashboard", (req, res) => {
  if (!req.session.admin) {
    return res.redirect("/login");
  }

  db.query(
    `
    SELECT
      (SELECT COUNT(*) FROM kategori) AS totalKategori,
      (SELECT COUNT(*) FROM produk) AS totalProduk,
      (SELECT COUNT(*) FROM pesanan) AS totalPesanan,
      (SELECT COALESCE(SUM(total),0) FROM pesanan) AS totalPendapatan
    `,
    (err, result) => {
      if (err) {
        return res.send(err);
      }

      res.render("dashboard", {
        admin: req.session.admin,
        statistik: result[0],
      });
    },
  );
});

app.get("/test-db", (req, res) => {
  db.query("SELECT * FROM kategori", (err, result) => {
    if (err) {
      return res.send(err);
    }

    res.json(result);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
