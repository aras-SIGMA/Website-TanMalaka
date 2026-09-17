# Tan Malaka — Arsip Perjuangan

Website blog statis berisi biografi **Tan Malaka**, pahlawan nasional Indonesia: perkenalan, sejarah
perjuangan, daftar buku karyanya, dan profil singkat.

Dibuat murni dengan **HTML, CSS, dan JavaScript native** — tanpa framework, tanpa library, tanpa proses build.

## Fitur

- **Struktur HTML semantik** — `header`, `nav`, `main`, `article`, `aside`, `footer`, `figure`, dan tabel data yang rapi.
- **Desain editorial gelap** dengan aksen merah, memakai CSS custom properties (variables) sehingga warna dan radius mudah diganti.
- **Responsif** — grid dua kolom di layar lebar, satu kolom plus menu hamburger di perangkat mobile.
- **Animasi vanilla JS:**
  - progress bar baca di paling atas halaman;
  - efek mengetik pada subjudul hero;
  - animasi angka statistik (easing `easeOutCubic`);
  - muncul perlahan (scroll-reveal) saat bagian masuk layar;
  - sorot tautan navigasi sesuai bagian yang sedang dilihat;
  - lightbox galeri sampul buku (klik, tombol prev/next, dan keyboard `←` `→` `Esc`);
  - tombol kembali ke atas dan parallax halus di hero.
- **Aksesibilitas** — skip link, atribut `aria-*`, navigasi keyboard, dan dukungan `prefers-reduced-motion` untuk pengguna yang tidak menginginkan animasi.

## Struktur Proyek

```
.
├── index.html      # halaman utama
├── sty.css         # seluruh gaya tampilan dan animasi CSS
├── script.js       # animasi & interaksi vanilla JavaScript
├── assets/
│   ├── Tan.jpeg            # foto profil Tan Malaka
│   ├── AksiMassa.jpg       # sampul buku Aksi Massa
│   ├── DariPenjara.jpg     # sampul buku Dari Penjara ke Penjara
│   ├── Gerpolek.jpg        # sampul buku Gerpolek
│   └── Madilog.jpg         # sampul buku Madilog
└── README.md
```

## Cara Menjalankan

Tidak ada dependensi yang perlu diinstal.

1. Unduh atau clone repositori ini.
2. Buka `index.html` langsung di browser (klik dua kali), **atau** jalankan server lokal:

   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js
   npx serve .
   ```

3. Buka `http://localhost:8000` di browser.

> Disarankan memakai server lokal (atau ekstensi Live Server di VS Code) agar perubahan langsung terlihat saat menyunting.

## Catatan Pengembangan

- **Warna utama** diatur di blok `:root` pada `sty.css` (`--merah`, `--merah-muda`, `--bg`, `--teks`, dan lainnya).
- **Menambah buku ke galeri:** tambahkan `figure.gallery__item` baru di dalam `ul.gallery__grid`
  pada `index.html`. Lightbox otomatis mengenali gambar baru, tidak perlu mengubah `script.js`.
- **Menonaktifkan animasi:** hapus kelas `reveal` pada elemen, atau atur *Reduced Motion* di sistem operasi —
  CSS sudah menanganinya lewat `@media (prefers-reduced-motion: reduce)`.
- Semua skrip berada dalam satu IIFE di `script.js` dan dimuat dengan atribut `defer`, sehingga aman
  untuk memperluas kode tanpa mengubah urutan pemuatan.

## Konten

Materi ditulis untuk keperluan pembelajaran sejarah. Seluruh gambar sampul buku dan foto digunakan
sebagai bahan referensi non-komersial.

## Lisensi

Bebas digunakan dan dimodifikasi untuk keperluan belajar.
