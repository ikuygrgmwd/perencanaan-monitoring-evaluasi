# Status preview statis

8 Oktober 2026 — Aplikasi diubah menjadi website statis sesuai instruksi terbaru pengguna.

## Tersedia

- Hasil build HTML/CSS/JavaScript dalam `out/`; tanpa API runtime atau database.
- Login dan logout simulasi untuk tujuh akun, profil, beranda, navigasi, dan pencarian.
- Data dummy: 7 organisasi, 7 akun, 4 domain, 6 lokus, 6 indikator, dan contoh aktivitas.
- Tampilan admin lintas organisasi dan tampilan enam peran sesuai organisasi/lokus.
- Tombol tambah dinonaktifkan; pengubahan dan penghapusan belum tersedia.
- Server preview statis lokal melalui `npm run preview` atau `npm start`.

## Hasil pemeriksaan

- `npm run build`: lulus dengan Webpack, seluruh route aplikasi diekspor statis.
- `npm run typecheck`: lulus.
- ESLint pada halaman aplikasi, komponen produk yang berubah, modul demo, dan skrip statis: lulus.
- `npm run test:static`: 3 pengujian lulus, mencakup tujuh akun dan relasi data, serta keberadaan seluruh HTML tanpa endpoint API.
- Browser pada hasil build: login tujuh akun berhasil; kata sandi salah ditolak; navigasi data lokus dan pencarian Bahari berhasil; sesi bertahan setelah refresh; logout dan redirect tanpa sesi berhasil; Pemda menampilkan dua lokus dan halaman akun admin menampilkan akses terbatas.
- Tidak ada error atau warning console pada pemeriksaan alur Admin/Pemda. Tampilan beranda diperiksa melalui screenshot.

Turbopack gagal memulai proses CSS di lingkungan Windows ini. Skrip build/dev memakai Webpack; build final berhasil. Koneksi preview melalui sandbox dibatasi, sehingga preview browser dijalankan di host pada http://127.0.0.1:3001/login/. Perintah biasa tetap memakai port 3000.

## Batasan

Login dan pembagian peran hanya simulasi di browser, bukan keamanan produksi. Seluruh fixture bersifat publik. Riwayat aktivitas tidak merekam aksi sesi saat ini. CRUD, program/kegiatan, monitoring, dashboard capaian, dan evaluasi belum tersedia.

Kode database terdahulu dipertahankan untuk pengembangan berikutnya, tetapi tidak digunakan oleh preview. Dokumen dan hasil pengujian fase 1 lama tidak menggambarkan kemampuan runtime statis saat ini.
