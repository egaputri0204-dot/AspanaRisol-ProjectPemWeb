function cekLogin(req, res, next) {
  if (!req.session.admin) {
    return res.redirect("/login");
  }

  next();
}

module.exports = cekLogin;
