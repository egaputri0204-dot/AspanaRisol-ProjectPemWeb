/**
 * Upload helper - kompatibel dengan local development dan Vercel serverless
 * 
 * Local: menyimpan file ke disk (public/uploads, public/bukti-transfer)
 * Vercel: menyimpan file ke memory, data disimpan sebagai base64 di database
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Apakah kita di lingkungan serverless?
const isServerless = !!process.env.VERCEL;

// Buat direktori upload jika belum ada (untuk local development)
function ensureDir(dir) {
  if (!isServerless && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Storage untuk local development (disk)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = getUploadDir(file);
    ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_"));
  },
});

function getUploadDir(file) {
  // Tentukan folder berdasarkan form field name
  if (file && file.fieldname === "bukti") {
    return path.join(__dirname, "..", "public", "bukti-transfer");
  }
  return path.join(__dirname, "..", "public", "uploads");
}

// Pilih storage berdasarkan environment
const storage = isServerless ? multer.memoryStorage() : diskStorage;

// Filter file (hanya gambar)
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File harus berupa gambar (JPG/PNG/GIF/WEBP)"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

/**
 * Mendapatkan URL/identifier untuk file yang diupload
 * Local: mengembalikan path file
 * Serverless: mengembalikan base64 data URL
 */
function getFileUrl(file) {
  if (!file) return null;

  if (isServerless) {
    // Di Vercel, konversi buffer ke base64 data URL
    const base64 = file.buffer.toString("base64");
    const mimeType = file.mimetype;
    return `data:${mimeType};base64,${base64}`;
  } else {
    // Lokal: path file
    return file.filename;
  }
}

module.exports = { upload, getFileUrl, isServerless };
