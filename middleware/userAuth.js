function userAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/user-login?login=required");
  }

  next();
}

module.exports = userAuth;
