# Ruang Perbatasan

Demo fungsional perencanaan, monitoring, dan evaluasi BWN–KP. Fase 1: fondasi, akun, hak akses, organisasi/unit, lokus, domain, dan indikator acuan. Data dan nama lokus merupakan simulasi.

## Menjalankan lokal

Gunakan Node.js 24 atau 26 dan npm:

```powershell
npm ci
npm run db:local
npm run dev
```

Buka http://localhost:3000/login. SQLite lokal tersimpan di `.data/demo.sqlite` dan diabaikan Git. Persiapan database dan seed idempoten; record yang sudah ada tidak ditimpa. Data D1 lama di `.wrangler/state` tetap tersimpan terpisah dan tidak otomatis dipindahkan.

Tanpa `DATABASE_URL`, aplikasi memakai SQLite lokal. Bila `.env.local` memuat `DATABASE_URL`, aplikasi memakai database cloud tersebut; perubahan lokal juga akan tersimpan ke database itu. Kredensial environment tidak boleh masuk Git.

## Akun simulasi

Semua akun contoh menggunakan kata sandi **DemoBnpp2027!**. Tombol akun pada halaman login hanya mengisi formulir; server tetap memeriksa kata sandi.

| Peran/unit | Email |
| --- | --- |
| Admin BNPP | admin@demo.bnpp.test |
| K/L | kl@demo.bnpp.test |
| Pemda | pemda@demo.bnpp.test |
| Batas darat | darat@demo.bnpp.test |
| Batas laut | laut@demo.bnpp.test |
| Batas udara | udara@demo.bnpp.test |
| PLBN | plbn@demo.bnpp.test |

Seed: 7 organisasi, 7 akun, 4 domain, 6 lokus fiktif, dan 6 indikator. Admin mengelola data acuan; pengguna biasa membaca data sesuai organisasi dan penugasan lokus. Akun baru memerlukan kata sandi minimal 12 karakter. Perubahan akun mencabut sesi akun tersebut.

## Vercel dan PostgreSQL

Runtime menggunakan Next.js App Router, React, TypeScript, dan Shadcn. Database online menggunakan Neon PostgreSQL melalui koneksi server; perubahan data dan audit disimpan dalam satu transaksi. Vercel menolak berjalan tanpa `DATABASE_URL` agar tidak menggunakan penyimpanan sementara secara diam-diam.

Konfigurasi proyek Vercel:

- Root directory: `aplikasi`
- Framework: Next.js; Node.js 24.x
- Install: `npm ci`; build: `npm run build`
- Environment: `DATABASE_URL`, disediakan integrasi Neon
- Region: Singapura (`sin1`)
- Branch produksi GitHub: `master`

Migrasi PostgreSQL terpisah berada di `db/postgres/`. Migrasi SQLite/Drizzle awal dipertahankan di `drizzle/`. Perubahan skema berikutnya harus mencakup kedua database bila mode lokal tetap didukung. Terapkan migrasi secara eksplisit, bukan dari endpoint publik atau setiap build:

```powershell
node --env-file=.env.local scripts/prepare-postgres.mjs
```

Skrip mencatat migrasi yang diterapkan dan menambahkan seed dengan `ON CONFLICT DO NOTHING`. Tidak mereset data yang sudah ada.

## Pemeriksaan

```powershell
npm run build
node node_modules/typescript/bin/tsc --noEmit
npm run start
# Di terminal lain, server localhost:3000 harus sedang berjalan:
npm run test:phase1
npm run test:cleanup
```

Untuk server lokal yang memakai PostgreSQL, pembersihan menggunakan environment yang sama:

```powershell
node --env-file=.env.local scripts/cleanup-test.mjs
```

Pengujian hanya menerima localhost dan membuat record sementara. File SQL pembersihan hanya memuat ID record yang dibuat pengujian. Hasil ada di `.sites-runtime/hasil-uji-fase1.json`. Pemeriksaan HTTP/render server tidak menggantikan pemeriksaan visual browser.

## Batas demo

Program/kegiatan fase 2, monitoring fase 3, dashboard capaian fase 4, dan evaluasi fase 5 belum tersedia. Menu fitur tersebut dinonaktifkan. Publikasi fase 1 dipercepat atas instruksi pengguna.

Kata sandi demo diketahui bersama. Gunakan hanya data simulasi. SSO instansi, audit keamanan produksi, dan pengujian beban belum termasuk demo ini.
