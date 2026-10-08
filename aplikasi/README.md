# Ruang Perbatasan

Demo fungsional perencanaan, monitoring, dan evaluasi BWN–KP. Implementasi saat ini mencakup fase 1: fondasi, akun, hak akses, organisasi/unit, lokus, domain, dan indikator acuan.

## Membuka demo yang sudah disiapkan

Jalankan `Mulai-Demo.cmd` di folder ini, atau gunakan:

```powershell
node --import ./scripts/sites-env.mjs scripts/run-framework.mjs dev
```

Biarkan proses tetap berjalan. Buka alamat Local yang dicetak, biasanya `http://127.0.0.1:5173/login`. Jika server sudah berjalan, gunakan alamat yang sama tanpa menjalankan salinan kedua. Aplikasi hanya tersedia di komputer ini selama server aktif.

## Akun simulasi

Semua akun contoh menggunakan kata sandi `DemoBnpp2027!`. Tombol pilihan akun pada halaman login mengisi formulir agar mudah didemonstrasikan; tombol tersebut tidak melewati pemeriksaan server.

| Peran/unit | Email |
| --- | --- |
| Admin BNPP | admin@demo.bnpp.test |
| K/L | kl@demo.bnpp.test |
| Pemda | pemda@demo.bnpp.test |
| Batas darat | darat@demo.bnpp.test |
| Batas laut | laut@demo.bnpp.test |
| Batas udara | udara@demo.bnpp.test |
| PLBN | plbn@demo.bnpp.test |

Data dummy: 7 organisasi, 7 akun, 4 domain, 6 lokus fiktif, dan 6 indikator. Tidak ada data atau capaian resmi. Nama unit masih berupa label simulasi.

## Skenario pemeriksaan manual

1. Masuk sebagai admin dan buka Organisasi & unit, Kawasan & lokus, Indikator acuan, serta Akun pengguna.
2. Tambahkan data contoh, ubah isinya, dan muat ulang halaman untuk memeriksa penyimpanan.
3. Nonaktifkan record contoh yang tidak diperlukan. Data acuan tidak dihapus melalui antarmuka.
4. Lihat Riwayat aktivitas untuk menelusuri perubahan.
5. Keluar, kemudian masuk sebagai pengguna PLBN. Pengguna ini hanya melihat organisasinya dan lokus Arunika yang ditugaskan.
6. Coba membuka `/akun` dengan akun pengguna: aplikasi menampilkan akses terbatas. Permintaan edit melalui API juga ditolak.
7. Coba login dengan kata sandi salah dan periksa pesan yang ditampilkan.

Akun yang baru ditambahkan memerlukan kata sandi minimal 12 karakter. Jika admin mengubah akun yang sedang digunakan, sesi akun tersebut dicabut dan pengguna perlu masuk kembali.

## Teknologi dan penyimpanan

React, TypeScript, Vinext dengan pola App Router, komponen Shadcn, serta SQLite melalui D1 lokal. Skema ada di `db/schema.ts`; migrasi berada di `drizzle/`. Vinext pada starter ini masih beta, sehingga pilihan runtime harus ditinjau sebelum produksi.

Data lokal berada di `.wrangler/state/` dan tidak masuk Git. Menghapus direktori tersebut menghilangkan data lokal. Tidak ada API cloud, akun hosting, atau variabel rahasia eksternal yang diperlukan untuk demo fase 1.

## Persiapan pada checkout baru

Gunakan Node.js minimal versi 22.13 dan npm. Pertahankan `package-lock.json`.

```powershell
npm run install:ci
node node_modules/drizzle-kit/bin.cjs generate
node scripts/prepare-local.mjs
npm run dev
```

Skrip persiapan membangun aplikasi, membuat skema fase 1 jika database kosong, lalu menambahkan seed dengan `INSERT OR IGNORE`. Skrip tidak menimpa record yang sudah ada. Jika skema telah berkembang melewati migrasi awal, skrip berhenti agar migrasi baru ditinjau secara sengaja.

Jangan mengulang file migrasi yang telah diterapkan. Untuk menambah skema pada fase berikutnya, ubah `db/schema.ts`, hasilkan migrasi baru, tinjau SQL, bangun ulang, lalu terapkan hanya migrasi yang belum dijalankan:

```powershell
node --import ./scripts/sites-env.mjs node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/NAMA_MIGRASI_BARU.sql
```

## Build dan pemeriksaan

```powershell
node node_modules/typescript/bin/tsc --noEmit
node --import ./scripts/sites-env.mjs scripts/run-framework.mjs build
node scripts/check-phase1.mjs
```

Pengujian API memerlukan dev server yang sedang berjalan. Pengujian hanya menerima alamat localhost. Record sementara dibuat khusus untuk pengujian; setelah pengujian, bersihkan record tersebut dengan file ID yang dihasilkan:

```powershell
node --import ./scripts/sites-env.mjs node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file .sites-runtime/cleanup-test.sql
```

Hasil tes berada di `.sites-runtime/hasil-uji-fase1.json`. Ringkasan pekerjaan dan batasan ada di `STATUS.md`. Pemeriksaan server tidak menggantikan pemeriksaan visual browser.

## Batas fase 1

Program dan kegiatan dibangun pada fase 2; monitoring fase 3; dashboard capaian fase 4; evaluasi fase 5; publikasi dan kesiapan presentasi penuh fase 6. Menu yang belum tersedia diberi label fase dan dinonaktifkan.

Kata sandi demo diketahui bersama. Jangan memasukkan data operasional atau membuka demo ini ke publik sebagai sistem produksi. Database dan sesi sudah memiliki kontrol dasar, tetapi demo belum melalui pengujian keamanan dan beban produksi.
