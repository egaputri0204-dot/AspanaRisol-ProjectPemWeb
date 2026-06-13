const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "aspanarisol",
});

db.connect((err) => {
  if (err) {
    console.log("Database gagal terhubung");
    console.log(err);
  } else {
    console.log("Database Connected");
  }
});

module.exports = db;
