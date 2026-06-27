const express = require("express");
const router = express.Router();

const db = require("../config/db");
const userAuth = require("../middleware/userAuth");
const { verifyPassword } = require("../utils/password");

// Register Admin
router.get("/register-admin", (req, res) => {
  res.render("registerAdmin");
});

router.post("/register-admin", (req, res) => {
  const { username, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.send(`
      <script>
        alert('Konfirmasi password tidak sama');
        window.location='/register-admin';
      </script>
    `);
  }

  db.query(
    "SELECT * FROM admin WHERE username=?",
    [username],
    (err, result) => {
      if (err) {
        return res.send(err);
      }

      if (result.length > 0) {
        return res.send(`
          <script>
            alert('Username sudah digunakan');
            window.location='/register-admin';
          </script>
        `);
      }

      db.query(
        "INSERT INTO admin(username,password) VALUES(?,?)",
        [username, password],
        (err) => {
          if (err) {
            return res.send(err);
          }

          res.send(`
            <script>
              alert('Admin berhasil didaftarkan');
              window.location='/login';
            </script>
          `);
        },
      );
    },
  );
});

// Login Admin
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM admin WHERE username=?", [username], async (err, result) => {
    if (err) {
      return res.send(err);
    }

    if (result.length === 0) {
      return res.send(`
        <script>
          alert('Username atau Password Salah');
          window.location='/login';
        </script>
      `);
    }

    const admin = result[0];
    const isValid = await verifyPassword(password, admin.password);

    if (!isValid) {
      return res.send(`
        <script>
          alert('Username atau Password Salah');
          window.location='/login';
        </script>
      `);
    }

    req.session.admin = admin;
    return res.redirect("/dashboard");
  });
});

// Logout Admin
router.get("/logout", (req, res) => {
  req.session.destroy();

  res.redirect("/login");
});

// Register User
router.get("/register", (req, res) => {
  res.render("registerUser");
});

router.post("/register", (req, res) => {
  const { username, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.send(`
      <script>
      alert('Konfirmasi password tidak sama');
      window.location='/register';
      </script>
    `);
  }

  db.query(
    "SELECT * FROM users WHERE username=?",
    [username],
    (err, result) => {
      if (err) {
        return res.send(err);
      }

      if (result.length > 0) {
        return res.send(`
          <script>
          alert('Username sudah digunakan');
          window.location='/register';
          </script>
        `);
      }

      db.query(
        `
        INSERT INTO users
        (username,email,password)
        VALUES (?,?,?)
        `,
        [username, email, password],
        (err) => {
          if (err) {
            return res.send(err);
          }

          res.send(`
            <script>
            alert('Register berhasil');
            window.location='/user-login';
            </script>
          `);
        },
      );
    },
  );
});

// Login User
router.get("/user-login", (req, res) => {
  res.render("loginUser", {
    loginRequired: req.query.login,
  });
});

router.post("/user-login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    `
    SELECT *
    FROM users
    WHERE username=?
    `,
    [username],
    async (err, result) => {
      if (err) {
        return res.send(err);
      }

      if (result.length === 0) {
        return res.send(`
          <script>
          alert('Username atau Password salah');
          window.location='/user-login';
          </script>
        `);
      }

      const user = result[0];
      const isValid = await verifyPassword(password, user.password);

      if (!isValid) {
        return res.send(`
          <script>
          alert('Username atau Password salah');
          window.location='/user-login';
          </script>
        `);
      }

      req.session.user = user;
      res.redirect("/");
    },
  );
});

// Logout User
router.get("/user-logout", (req, res) => {
  req.session.destroy();

  res.redirect("/");
});

// Riwayat Pesanan
router.get("/pesanan-saya", userAuth, (req, res) => {
  db.query(
    `
    SELECT *
    FROM pesanan
    WHERE user_id = ?
    ORDER BY id DESC
    `,
    [req.session.user.id],
    (err, result) => {
      if (err) return res.send(err);

      res.render("pesananSaya", {
        pesanan: result,
      });
    },
  );
});

// Detail Pesanan Saya
router.get("/pesanan-detail/:id", userAuth, (req, res) => {
  const id = req.params.id;

  db.query(
    `
    SELECT
      p.*,
      dp.jumlah,
      pr.nama_produk,
      pr.harga,
      pr.gambar
    FROM pesanan p
    JOIN detail_pesanan dp
      ON p.id = dp.pesanan_id
    JOIN produk pr
      ON dp.produk_id = pr.id
    WHERE p.id = ?
    `,
    [id],
    (err, result) => {
      if (err) {
        return res.send(err);
      }

      if (result.length === 0) {
        return res.send("Pesanan tidak ditemukan");
      }

      res.render("detailPesananUser", {
        pesanan: result[0],
        detail: result,
      });
    },
  );
});

module.exports = router;
