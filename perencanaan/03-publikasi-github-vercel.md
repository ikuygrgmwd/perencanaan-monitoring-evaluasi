# Publikasi GitHub dan preview statis

## Keputusan terbaru — 8 Oktober 2026

Pengguna meminta aplikasi diubah menjadi website statis, menyediakan login demo dan data dummy, menunda CRUD, serta mengirim pembaruan ke GitHub yang sudah terhubung.

- Repositori: https://github.com/ikuygrgmwd/perencanaan-monitoring-evaluasi
- Branch: `master`.
- Root aplikasi: `aplikasi`.
- Build: `npm run build`; keluaran: `out/`.
- Preview lokal: `npm run preview`.
- Database, migrasi, seed, dan environment tidak diperlukan.

## Hosting yang terhubung ke GitHub

Konfigurasi Vercel di `aplikasi/vercel.json` menggunakan static export Next.js dengan output `out`. Gunakan Node.js 24.x dan install `npm ci`. Deploy otomatis mengikuti konfigurasi integrasi GitHub pada akun pemilik.

Pembaruan kode ke GitHub tidak dengan sendirinya membuktikan deployment online berhasil. Verifikasi URL deployment secara terpisah bila diperlukan. Pada pekerjaan ini yang diuji adalah hasil build statis lokal.

Kode database lama disimpan sebagai arsip untuk pengembangan CRUD berikutnya; data dan kredensial lokal tidak dikirim ke GitHub. Login demo hanya untuk meninjau tampilan, bukan autentikasi produksi.
