const mysql = require("mysql2");

let pool = null;
let dbStatus = "disconnected";

function getPool() {
  if (!pool) {
    const host = process.env.DB_HOST || "localhost";
    const isLocal = host === "localhost" || host === "127.0.0.1";

    try {
      const config = {
        host: host,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "aspanarisol",
        port: parseInt(process.env.DB_PORT || "3306"),
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        connectTimeout: 5000,
      };

      pool = mysql.createPool(config);

      // Test koneksi (non-blocking)
      pool.query("SELECT 1 AS test", (err) => {
        if (err) {
          console.error("Database connection failed:", err.message);
          dbStatus = "error: " + err.message;
        } else {
          console.log("Database pool created & connected");
          dbStatus = "connected";
        }
      });

      // Fallback jika gagal
      setTimeout(() => {
        if (dbStatus === "disconnected") {
          console.log("Database connection timeout - using fallback");
          dbStatus = "timeout";
        }
      }, 6000).unref();
    } catch (err) {
      console.error("Failed to create database pool:", err.message);
      dbStatus = "error: " + err.message;
      pool = {
        query: (sql, params, cb) => {
          if (typeof cb === "function") cb(new Error("Database not available"));
          else if (typeof params === "function") params(new Error("Database not available"));
        },
      };
    }
  }
  return pool;
}

// Helper untuk cek status DB
function isConnected() {
  return dbStatus === "connected";
}

module.exports = {
  query: (sql, params, callback) => {
    if (!isConnected() && dbStatus !== "disconnected") {
      const err = new Error("Database tidak tersedia: " + dbStatus);
      if (typeof params === "function") return params(err);
      if (typeof callback === "function") return callback(err);
      return;
    }

    try {
      const p = getPool();
      if (typeof params === "function") {
        p.query(sql, params);
      } else {
        p.query(sql, params, callback);
      }
    } catch (err) {
      console.error("Database query error:", err);
      if (typeof params === "function") {
        params(err);
      } else if (typeof callback === "function") {
        callback(err);
      }
    }
  },
  getPool: getPool,
  isConnected: isConnected,
};
