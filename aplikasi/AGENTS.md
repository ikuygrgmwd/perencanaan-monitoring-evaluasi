# Panduan pengembangan Ruang Perbatasan

Semua komunikasi, dokumentasi, dan teks produk menggunakan Bahasa Indonesia.

## Status dan batas lingkup

Fase 1 meliputi akun, sesi, hak akses, navigasi, data acuan, dan audit. Jangan menganggap modul program, monitoring, dashboard capaian, atau evaluasi sudah selesai. Lanjutkan fase berikutnya setelah instruksi pengguna.

Demo menggunakan data simulasi. Nama unit batas darat/laut/udara sementara terpisah dan dapat disesuaikan. Referensi dan keputusan produk berada di `../perencanaan/`.

## Peta kode

- `app/api/[...path]/route.ts`: endpoint login/logout dan data acuan; validasi peran dilakukan server.
- `lib/server.ts`: helper keamanan, hash kata sandi, sesi, CSRF/origin, dan helper respons.
- `lib/master-data.ts`: query dengan lingkup akses dan penyimpanan data acuan.
- `lib/model.ts`: tipe data bersama; tidak berisi kredensial.
- `db/schema.ts` dan `drizzle/`: skema dan migrasi; jangan mengubah migrasi yang sudah diterapkan.
- `components/product/`: komponen produk. Gunakan komponen aksesibel dari `components/ui/` tanpa mengubah vendor untuk styling.
- `scripts/seed-demo.mjs`: seed simulasi idempoten. Tidak dipanggil dari endpoint publik.
- `scripts/check-phase1.mjs`: pengujian API lokal; menghasilkan SQL pembersihan hanya untuk record test yang dibuatnya.

## Aturan

Pertahankan pembatasan akses pada setiap endpoint dan halaman server. Jangan memakai localStorage sebagai database atau mengirim password_hash/token sesi melalui respons data. Jangan menghapus data referensi yang sudah dipakai; gunakan status nonaktif. Login demo dengan kata sandi contoh bukan autentikasi produksi.

Jalankan pemeriksaan TypeScript dan pengujian yang sesuai perubahan. Pemeriksaan visual belum dapat dilakukan karena browser otomatis terblokir batas penggunaan layanan, bukan karena build gagal. Jangan mengklaim UI telah diuji melalui browser sebelum benar-benar diverifikasi.

Pengguna telah meminta publikasi fase 1 ke GitHub ikuygrgmwd dan Vercel. Gunakan Next.js serta Neon PostgreSQL untuk online; SQLite untuk lokal. Pertahankan skema kedua adapter saat mengubah data. Dokumen publikasi berada di ../perencanaan/03-publikasi-github-vercel.md.
