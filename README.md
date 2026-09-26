# Portofolio Pribadi Modern & Clean Minimalist

Website portofolio pribadi responsif, elegan, dan berkinerja tinggi yang dibangun dengan HTML5 semantik, CSS3 modern (dengan sistem variabel tema Terang/Gelap), dan JavaScript interaktif murni (tanpa dependensi eksternal yang berat).

---

## 🌟 Fitur Utama

- **Estetika Clean Minimalist**:
  - Palet warna lembut bernuansa slate dengan aksen royal indigo, sky cyan, dan emerald.
  - Tipografi rapi menggunakan kombinasi Google Fonts (*Plus Jakarta Sans* untuk judul dan *Inter* untuk keterbacaan teks utama).
  - Efek glassmorphism halus dengan border reflektif dan shadow lembut.
- **Dukungan Dark & Light Mode**:
  - Tombol switcher tema interaktif di navbar.
  - Menyimpan preferensi tema pengunjung di `localStorage`.
  - Otomatis mendeteksi preferensi sistem (`prefers-color-scheme`).
- **Hero Section Dinamis**:
  - Status badge animasi berdenyut (*"Tersedia untuk Proyek Baru & Freelance"*).
  - Foto profil beresolusi tinggi dengan floating micro-badges (*Lighthouse Score 100/100*, *Modern Tech Stack*).
  - Quick action CTA: Lihat Proyek, Diskusikan Proyek, dan Download CV.
  - Tautan media sosial dan tombol salin email dengan feedback toast.
- **Metrics Counter Otomatis**:
  - Animasi hitung angka otomatis saat pengguna menggulir ke bagian statistik.
- **Kategori Keahlian (Tech Stack)**:
  - Pembagian kategori terstruktur: *Frontend Engineering*, *Backend & Database*, serta *Tools & DevOps*.
- **Showcase Portofolio Interaktif**:
  - Filter kategori real-time (*Semua*, *Dashboard & SaaS*, *FinTech & Web*, *AI & Produktivitas*).
  - Modal Popup detail proyek lengkap dengan fitur kunci, deskripsi, teknologi, dan live link.
- **Jejak Karier & Timeline Pengalaman**:
  - Layout timeline vertikal bersih untuk riwayat pekerjaan dan edukasi.
- **Testimoni Klien**:
  - Kartu ulasan dengan rating bintang dan kutipan rekomendasi profesional.
- **Formulir Kontak Validasi Real-time**:
  - Pengecekan input nama, email valid, topik diskusi, dan pesan.
  - Simulasi pengiriman responsif dengan animasi spinner dan notifikasi toast.
- **SEO & Aksesibilitas**:
  - Meta tags Open Graph, semantic HTML5, aria-labels, dan performa instan tanpa framework bloat.

---

## 📁 Struktur Direktori

```text
personal-portfolio/
├── assets/
│   └── images/
│       ├── avatar.jpg              # Foto profil hero
│       ├── project-analytics.jpg   # Preview Proyek Analytics Hub
│       ├── project-fintech.jpg     # Preview Proyek NeoBank
│       └── project-ai.jpg          # Preview Proyek Aurora AI
├── index.html                      # Struktur markup halaman utama
├── style.css                       # Desain sistem, variabel warna & dark mode
├── script.js                       # Logika interaktif & event handlers
├── server.js                       # Server lokal ringan (Node.js native)
└── README.md                       # Dokumentasi panduan
```

---

## 🚀 Cara Menjalankan Proyek

### Opsi 1: Menjalankan dengan Node.js (Server Lokal)

Proyek ini telah dilengkapi dengan `server.js` bawaan Node.js tanpa dependensi npm:

```bash
node server.js
```

Buka peramban (browser) Anda dan akses:
👉 **[http://localhost:3000](http://localhost:3000)**

### Opsi 2: Buka Langsung Berkas HTML
Anda juga dapat membuka berkas `index.html` secara langsung di Google Chrome, Microsoft Edge, atau browser pilihan Anda dengan klik ganda (*double click*).

---

## ✏️ Panduan Kustomisasi Konten

1. **Ubah Nama & Bio**:
   - Buka `index.html` dan cari teks `Alex Danuarta` atau `Alex.dev`, lalu ganti dengan nama lengkap dan inisial Anda.
2. **Ganti Foto Profil & Gambar Proyek**:
   - Letakkan foto Anda di dalam folder `assets/images/avatar.jpg` atau ubah path `src` di `index.html`.
3. **Kustomisasi Riwayat & Kontak**:
   - Sesuaikan alamat email (`contact@alexdanuarta.dev`) dan nomor WhatsApp pada bagian `#contact` di `index.html` dan variabel `emailToCopy` di `script.js`.
4. **Warna Aksen**:
   - Jika ingin mengubah warna utama, cukup sesuaikan nilai CSS variable `--primary` di bagian `:root` pada file `style.css`.
