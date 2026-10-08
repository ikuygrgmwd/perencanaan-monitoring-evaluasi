# Ruang Perbatasan — preview statis

Versi saat ini menggunakan Next.js static export. Login, navigasi, pencarian, profil, dan data acuan dapat dipreview tanpa database, migrasi, seed, atau environment khusus.

## Menjalankan

Gunakan Node.js 24 atau 26 dan npm, dari folder `aplikasi`:

```powershell
npm ci
npm run build
npm run preview
```

Buka http://localhost:3000/login/. `npm start` juga menjalankan preview statis. Untuk pengembangan gunakan `npm run dev`. Di Windows tersedia `Mulai-Demo.cmd` yang memasang dependensi bila perlu, membangun aplikasi, lalu membuka preview.

Build menghasilkan folder `out/` berisi HTML, CSS, dan JavaScript. Folder ini dapat disajikan oleh hosting statis pada root domain. Gunakan HTTP, bukan membuka HTML melalui `file://`. Build memakai Webpack untuk menghindari kegagalan proses CSS Turbopack pada lingkungan Windows ini.

## Akun demo

Kata sandi semua akun: **DemoBnpp2027!**. Pilih tombol peran, lalu klik **Masuk**.

| Peran | Email |
| --- | --- |
| Admin BNPP | admin@demo.bnpp.test |
| K/L | kl@demo.bnpp.test |
| Pemda | pemda@demo.bnpp.test |
| Batas darat | darat@demo.bnpp.test |
| Batas laut | laut@demo.bnpp.test |
| Batas udara | udara@demo.bnpp.test |
| PLBN | plbn@demo.bnpp.test |

Login ini simulasi di browser, bukan autentikasi produksi. `sessionStorage` hanya menyimpan pilihan akun sampai tab ditutup; sesi bertahan saat refresh. Data acuan berasal dari `lib/demo-data.ts`, tidak disimpan di localStorage atau database. Semua data dummy dapat dibaca dari aset publik. Pembagian peran hanya memperagakan tampilan, bukan perlindungan data rahasia.

Tersedia 7 organisasi, 7 akun, 4 domain, 6 lokus fiktif, 6 indikator, dan contoh aktivitas. Admin melihat seluruh data; peran lainnya melihat organisasi dan lokus terkait. Pencarian berfungsi. Tambah, ubah, dan hapus belum tersedia. Menu program, monitoring, dashboard capaian, dan evaluasi tetap menunggu tahap berikutnya.

## GitHub dan hosting

Repositori: https://github.com/ikuygrgmwd/perencanaan-monitoring-evaluasi — branch `master`.

Untuk proyek Vercel yang terhubung, gunakan root directory `aplikasi`, install `npm ci`, build `npm run build`, output `out`, dan Node.js 24.x. Konfigurasi berada di `vercel.json`. Preview ini tidak memerlukan `DATABASE_URL` atau integrasi Neon; environment lama tidak digunakan oleh halaman statis.

## Pemeriksaan

```powershell
npm run build
npm run typecheck
npm run test:static
npm run preview
```

Pengujian statis memeriksa relasi dan lingkup data tujuh akun serta keberadaan seluruh HTML tanpa API. Periksa juga login benar/salah, navigasi, pencarian, refresh, dan logout melalui browser.

## Implementasi database sebelumnya

API lama disimpan di `legacy/api-route.ts` dan tidak terdaftar sebagai endpoint. Helper database, skema, migrasi, formulir CRUD lama, dan skrip pengujian fase 1 dipertahankan untuk pengembangan berikutnya, tetapi tidak dipakai preview ini. Jangan menjalankan `db:*`, `test:phase1`, atau `test:cleanup` untuk mencoba preview statis.
