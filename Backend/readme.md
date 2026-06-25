# Backend API - CV Globalindo Teknik Mandiri

Ini adalah _source code_ untuk Backend API (Node.js, Express, MySQL) proyek CV Globalindo Teknik Mandiri.

## 📋 Persyaratan Sistem
Sebelum menjalankan aplikasi ini, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (disarankan versi 18 ke atas)
- MySQL Server (bisa menggunakan XAMPP, Laragon, dsb.)
- Git

## 🛠️ Tata Cara Instalasi

Karena beberapa file seperti `node_modules` dan `.env` tidak ikut tersimpan di Git (berada di dalam `.gitignore`), Anda harus mengikuti langkah-langkah ini saat pertama kali melakukan *clone* atau memindahkan proyek:

### 1. Install Dependensi
Buka terminal di dalam folder `Backend` ini, lalu jalankan perintah:
```bash
npm install
```
Perintah ini akan membaca `package.json` dan men-*download* seluruh _library_ yang dibutuhkan (seperti Express, Prisma, Multer, dll) ke dalam folder `node_modules`.

### 2. Konfigurasi Environment Variables (`.env`)
Buat file baru bernama `.env` tepat di akar folder `Backend` ini. Anda bisa meng-copy format berikut dan menyesuaikannya dengan kredensial database Anda.

Isi file `.env`:
```env
# URL Koneksi Database MySQL Anda
# Format: mysql://USER:PASSWORD@HOST:PORT/NAMA_DATABASE
DATABASE_URL="mysql://root:@localhost:3306/globalindo_db"

# Kunci rahasia untuk Token JWT (Bebas diisi apa saja)
JWT_SECRET="supersecretkey123!@#"

# Port server API berjalan
PORT=5000
```

### 3. Setup Database (Prisma)
Pastikan MySQL Anda sudah menyala dan buat database kosong dengan nama `globalindo_db` di phpMyAdmin Anda. Setelah itu, jalankan perintah ini untuk merender tabel-tabel ke dalam database:
```bash
npx prisma db push
```
Lalu, pastikan Prisma Client terbaru terbentuk dengan menjalankan:
```bash
npx prisma generate
```

### 4. Membuat Akun Admin Pertama (Seeder)
Agar Anda bisa _login_ ke halaman admin, jalankan script *seeder* ini untuk membuat akun default:
```bash
node src/seed.js
```
*(Akun yang akan dibuat: Username: `admin`, Password: `admin123`)*

## 🚀 Menjalankan Server
Untuk keperluan *development*, jalankan server menggunakan *Nodemon* (server akan otomatis _restart_ jika ada file yang diubah):
```bash
npm run dev
```
Jika sukses, terminal akan menampilkan `Server is running on port 5000`.

---
**Catatan:** Folder `public/uploads` akan otomatis digunakan sebagai tempat menyimpan file gambar produk dan banner yang Anda _upload_. Folder ini ikut di-*track* di Git namun kontennya mungkin kosong saat awal, pastikan foldernya tetap ada.
