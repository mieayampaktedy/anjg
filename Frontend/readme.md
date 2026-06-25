# Panduan Frontend Web - CV Globalindo Teknik Mandiri

Halaman ini berisi petunjuk cara menginstal, menjalankan, dan memahami kode sumber (source code) bagian **Frontend** (sisi tampilan pengguna) dari website CV Globalindo Teknik Mandiri.

Tampilan website ini dibuat menggunakan **React.js**, **Vite** (sebagai builder cepat), dan **Tailwind CSS** untuk desain visualnya.

---

## 📋 Persyaratan Sebelum Mulai
Sebelum Anda menginstal aplikasi ini, pastikan komputer Anda sudah memiliki program berikut:
1. **Node.js** (Sangat disarankan versi 18 ke atas) - [Download Node.js](https://nodejs.org/)
2. **Git** (Untuk download/clone repositori)

---

## 🛠️ Cara Instalasi & Menjalankan Aplikasi (Langkah Demi Langkah)

Ikuti langkah-langkah di bawah ini untuk pertama kali setelah Anda mengunduh proyek ini:

### Langkah 1: Buka Folder Proyek
Buka aplikasi Terminal / Command Prompt (CMD), lalu masuk ke dalam folder **Frontend** ini.
*(Tips: Di VS Code, Anda bisa klik kanan folder `Frontend` lalu pilih "Open in Integrated Terminal").*

### Langkah 2: Install Seluruh Dependensi (Library pendukung)
Jalankan perintah berikut di terminal:
```bash
npm install
```
*Perintah ini akan otomatis mengunduh semua library yang diperlukan (seperti React, React Router, Tailwind, dll.) dan menyimpannya di folder baru bernama `node_modules`.*

### Langkah 3: Membuat Berkas Pengaturan API (.env)
1. Buat file baru bernama `.env` tepat di dalam folder utama `Frontend` ini.
2. Salin teks berikut ke dalam file `.env` tersebut:
   ```env
   # URL untuk menghubungkan Frontend ke Backend API
   VITE_API_URL="http://localhost:5000/api"
   ```

### Langkah 4: Jalankan Server Lokal (Development)
Untuk melihat tampilan website langsung di browser Anda, jalankan perintah:
```bash
npm run dev
```
Setelah berjalan, terminal akan memunculkan alamat web lokal. Klik alamat tersebut (biasanya **http://localhost:5173** atau **http://localhost:3000**) untuk membuka website di browser Anda.

---

## 🚀 Perintah Terminal Lainnya

* **Menguji Kerapian Kode (Linter)**:
  ```bash
  npm run lint
  ```
  *(Digunakan untuk memeriksa apakah ada penulisan kode yang salah atau tidak rapi sebelum dikirim).*

* **Membuat File Produksi (Build)**:
  ```bash
  npm run build
  ```
  *(Digunakan untuk memaketkan seluruh kode menjadi file HTML, CSS, dan JS statis yang siap diunggah ke hosting atau server online).*

---

## 📂 Penjelasan Struktur Folder

Berikut adalah panduan singkat agar Anda tidak bingung saat membaca struktur folder proyek ini:

* 📁 `src/components/` - Komponen kecil website yang bisa dipakai berulang kali (Tombol, Input, dll).
  * 📁 `src/components/product/` - Komponen khusus untuk detail produk seperti Galeri, Tabel Spek, dan Produk Terkait.
* 📁 `src/pages/` - Halaman-halaman utama website.
  * 📁 `src/pages/public/` - Halaman yang bisa diakses publik (Beranda, Katalog Produk, Detail Produk, Artikel, Tentang Kami, Hubungi Kami).
  * 📁 `src/pages/admin/` - Halaman Dashboard khusus Admin (Kelola Produk, Kelola Kategori, Kelola Artikel, Pengaturan).
* 📁 `src/contexts/` - Logika global website seperti sistem login admin (`AuthContext`) dan pergantian tema gelap/terang (`ThemeContext`).
* 📁 `src/data/` - Berkas data produk dan artikel lokal (mock data) untuk kebutuhan uji coba tanpa database.

---

## ✨ Fitur Tampilan Menarik (Design System)
* **Desain B2B Profesional (Soft Enterprise)**: Tampilan formal kelas industri dengan efek visual halus, sudut rounded tebal, dan bayangan tipis yang nyaman di mata.
* **Galeri Produk Interaktif**: Mendukung usap layar (swipe gesture) di handphone menggunakan Embla Carousel, tombol panah kiri-kanan saat kursor diarahkan, navigasi keyboard (panah kiri/kanan), dan pemutaran video YouTube di tab baru.
* **Optimasi SEO**: Judul dan deskripsi halaman berubah otomatis secara dinamis untuk memudahkan pencarian Google.
* **Integrasi WhatsApp & RFQ**: Tombol pintas untuk langsung berkonsultasi ke WhatsApp atau meminta penawaran harga resmi (RFQ).