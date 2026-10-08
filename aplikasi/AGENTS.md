# Panduan pengembangan Ruang Perbatasan

Semua komunikasi, dokumentasi, dan teks produk menggunakan Bahasa Indonesia.

## Instruksi terbaru — 8 Oktober 2026

Pengguna meminta website statis yang dapat dipreview, login demo dan data dummy, menunda CRUD, serta mengirim pembaruan ke GitHub yang terhubung. Instruksi ini menggantikan kewajiban database pada runtime preview sebelumnya.

## Peta kode dan aturan

- `app/[section]/page.tsx`: daftar halaman untuk static export.
- `components/product/demo-workspace.tsx`: pemilihan tampilan berdasarkan sesi demo.
- `lib/demo-data.ts`: data fiktif publik, akun dan lingkup tampilan.
- `lib/demo-session.ts`: pilihan akun di sessionStorage; bukan autentikasi produksi.
- `components/product/`: antarmuka; gunakan komponen aksesibel `components/ui/` tanpa mengubah vendor untuk styling.
- `legacy/api-route.ts`, `lib/server.ts`, `lib/master-data.ts`, `lib/database.ts`, `db/`, `drizzle/`: implementasi database sebelumnya, tidak dipakai preview. Jangan mengubah migrasi yang sudah diterapkan atau menghilangkan pemeriksaan akses pada kode arsip.
- `scripts/preview-static.mjs`: server lokal untuk folder `out/`.
- `scripts/check-static.test.mjs`: pemeriksaan data dan keluaran statis.

Jangan menyimpan data operasional dalam aset statis. Jangan memakai localStorage sebagai database. Tegaskan login demo bukan keamanan produksi; riwayat aktivitas hanyalah contoh. Jangan mengaktifkan kontrol CRUD tanpa implementasi yang sesuai.

Program/kegiatan, monitoring, dashboard capaian, dan evaluasi tetap tahap berikutnya. Jangan mengklaim modul tersebut selesai.

Jalankan build, TypeScript, pengujian statis, dan pemeriksaan browser sesuai perubahan. Jangan mengklaim verifikasi visual sebelum dilakukan. GitHub terhubung ke `ikuygrgmwd/perencanaan-monitoring-evaluasi`, branch `master`. Root hosting adalah `aplikasi`, output `out`; tanpa database atau environment wajib.
