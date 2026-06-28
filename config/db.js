const mysql = require("mysql2");

let pool = null;
let dbStatus = "disconnected";

function hasDbConfig() {
  return !!(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
}

function canUseDatabase() {
  return !process.env.VERCEL || hasDbConfig();
}

function getPool() {
  if (!pool) {
    const isVercel = !!process.env.VERCEL;

    if (isVercel && !hasDbConfig()) {
      dbStatus = "unconfigured";
      pool = {
        query: (sql, params, cb) => {
          const err = new Error(
            "Database tidak dikonfigurasi untuk environment ini",
          );
          if (typeof cb === "function") return cb(err);
          if (typeof params === "function") return params(err);
        },
      };
      return pool;
    }

    try {
      const host = process.env.DB_HOST || "localhost";
      const config = {
        host,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "aspanarisol",
        port: Number(process.env.DB_PORT || 3306),
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
        connectTimeout: 10000,
      };

      if (host.includes("tidbcloud.com")) {
        config.ssl = {
          minVersion: "TLSv1.2",
          rejectUnauthorized: false,
        };
      }

      pool = mysql.createPool(config);
      dbStatus = "connected";
    } catch (err) {
      console.error("Failed to create database pool:", err.message);
      dbStatus = "error: " + err.message;
      pool = {
        query: (sql, params, cb) => {
          const error = new Error("Database not available");
          if (typeof cb === "function") return cb(error);
          if (typeof params === "function") return params(error);
        },
      };
    }
  }
  return pool;
}

function isConnected() {
  return dbStatus === "connected";
}

module.exports = {
  canUseDatabase,
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
