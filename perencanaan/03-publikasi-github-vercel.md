# Publikasi GitHub dan Vercel

## Instruksi terbaru pengguna

Pengguna meminta repositori diunggah ke akun GitHub `ikuygrgmwd` dan dihubungkan ke Vercel agar demo dapat diakses online. Instruksi ini mempercepat publikasi fase 1, tanpa memperluas fitur fase 2–5.

## Status 8 Oktober 2026

- Repositori private telah dibuat: https://github.com/ikuygrgmwd/perencanaan-monitoring-evaluasi
- Branch aktif dan remote: `master`, `origin/master`.
- Sumber aplikasi, seed data simulasi, pengujian, dan dokumen perencanaan telah diunggah.
- Dokumen referensi asli/hasil ekstraksi, database lokal, hasil build, dan kredensial tidak diunggah.
- Koneksi Vercel yang tersedia mengembalikan `403 forbidden` saat mengakses workspace. Login resmi Vercel CLI telah dimulai dan membutuhkan autentikasi pemilik akun.
- Belum ada proyek Vercel atau deployment online yang berhasil dibuat untuk aplikasi ini.

## Pekerjaan setelah akses Vercel tersedia

1. Verifikasi akun/workspace tujuan dan hubungkan repositori dengan root directory `aplikasi`.
2. Sesuaikan runtime Vinext/Cloudflare lokal untuk Vercel dan siapkan database cloud persisten. Database D1 lokal tidak dapat langsung dipakai di Vercel.
3. Terapkan skema dan seed simulasi secara idempoten; simpan kredensial hanya dalam environment hosting.
4. Jalankan build dan pemeriksaan login, hak akses, penyimpanan, serta audit pada runtime tujuan.
5. Deploy, verifikasi URL aktif, dan periksa integrasi pembaruan dari GitHub.

Demo online tetap memakai data simulasi dan bukan sistem operasional produksi.
