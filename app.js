const express = require("express");
const path = require("path");
require("dotenv").config();
const session = require("express-session");
const db = require("./config/db");

// Routes
const homeRoutes = require("./routes/home");
const kategoriRoutes = require("./routes/kategori");
const produkRoutes = require("./routes/produk");
const pesananRoutes = require("./routes/pesanan");
const checkoutRoutes = require("./routes/checkout");
const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payment");

const app = express();

// =======================
// KONFIGURASI DASAR
// =======================
app.get("/ping", (req, res) => {
  res.send("pong");
});
app.set("trust proxy", 1);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 5000);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =======================
// SESSION — pilih store berdasarkan environment
// =======================

let sessionStore;

// Deteksi environment
const isVercel = !!process.env.VERCEL;
const isProduction = process.env.NODE_ENV === "production" || isVercel;

if (isVercel || !process.env.DB_HOST || process.env.DB_HOST === "localhost") {
  // Di Vercel atau tanpa DB cloud, pakai MemoryStore
  console.log("Session store: MemoryStore (no cloud database configured)");
} else {
  // Coba inisialisasi MySQL session store
  try {
    const MySQLStore = require("express-mysql-session")(session);
    const pool = db.getPool();
    sessionStore = new MySQLStore(
      {
        createDatabaseTable: true,
        schema: {
          tableName: "session",
          columnNames: {
            session_id: "session_id",
            expires: "expires",
            data: "data",
          },
        },
      },
      pool,
    );
    console.log("Session store: MySQL");
  } catch (err) {
    console.log(
      "Session store: MemoryStore (MySQL not available: " + err.message + ")",
    );
  }
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "aspanarisol-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  }),
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// =======================
// STATIC FILES
// =======================
app.use(express.static(path.join(__dirname, "public")));

// =======================
// ROUTES
// =======================
app.use("/", homeRoutes);
app.use("/kategori", kategoriRoutes);
app.use("/produk", produkRoutes);
app.use("/pesanan", pesananRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/", authRoutes);
app.use("/", paymentRoutes);

// Dashboard
app.get("/dashboard", (req, res) => {
  if (!req.session.admin) return res.redirect("/login");
  db.query(
    `SELECT
      (SELECT COUNT(*) FROM kategori) AS totalKategori,
      (SELECT COUNT(*) FROM produk) AS totalProduk,
      (SELECT COUNT(*) FROM pesanan) AS totalPesanan,
      (SELECT COUNT(*) FROM pesanan WHERE status_pembayaran='Lunas') AS totalLunas,
      (SELECT COUNT(*) FROM pesanan WHERE status_pembayaran='Belum Bayar') AS totalBelumBayar,
      (SELECT COALESCE(SUM(total),0) FROM pesanan WHERE status_pembayaran='Lunas') AS totalPendapatan`,
    (err, result) => {
      if (err) return res.send(err);
      res.render("dashboard", {
        admin: req.session.admin,
        statistik: result[0],
      });
    },
  );
});

app.get("/test-db", (req, res) => {
  db.query("SELECT 1 AS test", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "ok", db: "connected", result });
  });
});

// =======================
// HANDLER 404 & ERROR
// =======================
app.use((req, res) => {
  res.status(404).send("Halaman tidak ditemukan: " + req.originalUrl);
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).send("Internal Server Error: " + err.message);
});

// =======================
// EXPORT
// =======================
if (require.main === module) {
  const PORT = app.get("port");
  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
    console.log("Mode:", process.env.NODE_ENV || "development");
  });
}

module.exports = app;
