const express = require("express");
const router = express.Router();

const db = require("../config/db");

// Form Login
router.get("/login", (req, res) => {
  res.render("login");
});

// Proses Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM admin WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) {
        return res.send(err);
      }

      if (result.length > 0) {
        req.session.admin = result[0];

        return res.redirect("/dashboard");
      }

      res.send("Username atau Password Salah");
    },
  );
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();

  res.redirect("/login");
});

module.exports = router;
