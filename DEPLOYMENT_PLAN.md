# Deployment Plan: Frontend di Vercel, Backend di Render

## Tujuan

Pisahkan frontend dan backend agar:

- Vercel hanya menangani halaman publik dan asset statis
- backend Express berjalan di Render/Railway yang lebih cocok untuk Node.js + MySQL

## Struktur yang disarankan

- Frontend: Vercel
- Backend API: Render
- Database: MySQL eksternal (mis. PlanetScale/Neon/Railway MySQL)

## Langkah

1. Siapkan backend Express di Render.
2. Set environment variables di Render:
   - DB_HOST
   - DB_USER
   - DB_PASSWORD
   - DB_NAME
   - DB_PORT
   - SESSION_SECRET
3. Ubah base URL API frontend menjadi URL Render.
4. Deploy frontend ke Vercel.

## Catatan penting

- Halaman home saat ini dibuat agar tidak bergantung pada DB saat environment Vercel.
- Untuk fitur penuh (produk, login, checkout, dashboard), backend harus terhubung ke DB eksternal.
