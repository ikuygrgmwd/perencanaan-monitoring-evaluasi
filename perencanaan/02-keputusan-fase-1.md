# Keputusan implementasi fase 1

Status: Eksekusi fase 1 diizinkan pengguna pada 8 Oktober 2026. Fase 2–6 belum dieksekusi.

## Cakupan

Fondasi aplikasi mencakup login/logout demo, pembatasan akses di server, navigasi, profil akun, organisasi/unit, lokasi penugasan, domain, indikator acuan, dan riwayat perubahan data acuan. Program, kegiatan, laporan, dashboard capaian, dan evaluasi tetap mengikuti fase berikutnya.

## Pilihan teknis awal

- React dan TypeScript dengan struktur App Router yang disediakan starter Sites/Vinext. UI memakai komponen Shadcn yang tersedia. Vinext masih berstatus beta pada dependensi starter; pilihan ini mempercepat demo, tetapi kompatibilitas dan pilihan runtime perlu ditinjau sebelum produksi.
- Route handler server menangani login dan data. Pemeriksaan akses tidak bergantung pada tombol atau penyaringan di browser.
- SQLite melalui binding D1 lokal menyimpan akun, sesi, organisasi, domain, lokasi, penugasan, indikator acuan, dan audit. Drizzle mendefinisikan skema dan menghasilkan migrasi. Tidak menggunakan localStorage sebagai database.
- Demo memakai akun lokal simulasi dengan hash kata sandi, token sesi acak yang hash-nya disimpan di database, cookie HttpOnly dan SameSite, pemeriksaan origin pada mutasi, serta kedaluwarsa sesi. Ini bukan SSO instansi.
- Penggunaan akun contoh dengan kata sandi yang dipublikasikan memang ditujukan untuk demonstrasi. Tidak cocok untuk data rahasia atau peluncuran publik tanpa perubahan autentikasi.
- Pratinjau lokal disediakan pada fase 1. Hosting dan publikasi tetap dibahas di fase 6 sesuai roadmap.

## Asumsi yang dapat diubah

- Nama kerja aplikasi: Ruang Perbatasan. Bukan identitas produk resmi yang sudah disahkan.
- Batas darat, batas laut, dan batas udara dibuat sebagai unit contoh terpisah. Pengelompokan final belum dikonfirmasi.
- Tujuh akun awal: admin BNPP, K/L, Pemda, batas darat, batas laut, batas udara, dan PLBN.
- Pengguna melihat profil organisasinya dan lokasi yang ditugaskan. Data domain dan definisi indikator merupakan acuan bersama. Admin dapat mengelola data acuan.
- Penambahan atau perubahan akun tidak memberi kewenangan pengesahan kebijakan. Detail pemeriksaan laporan tetap diputuskan pada fase 3.
- Hanya data acuan untuk fase 1 yang disiapkan. Paket 4 program, 12 kegiatan, dan 24 laporan disiapkan pada fase yang membutuhkan data tersebut.

## Pemeriksaan penerimaan

Login benar/salah, logout dan kedaluwarsa, penolakan akses tanpa sesi, pemisahan lingkup pengguna, penolakan mutasi pengguna biasa, CRUD data acuan oleh admin, penyimpanan setelah reload, audit, validasi duplikasi, akses lewat keyboard, serta tampilan desktop dan ponsel.

Setiap hasil uji dan batasan aktual dicatat dalam laporan fase 1 setelah pemeriksaan selesai.
