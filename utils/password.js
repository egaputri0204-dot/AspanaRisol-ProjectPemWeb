const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  if (!password) return password;
  if (password.startsWith("$2")) return password;
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password, storedPassword) {
  if (!storedPassword) return false;
  if (storedPassword.startsWith("$2")) {
    return bcrypt.compare(password, storedPassword);
  }
  return password === storedPassword;
}

module.exports = {
  hashPassword,
  verifyPassword,
};
