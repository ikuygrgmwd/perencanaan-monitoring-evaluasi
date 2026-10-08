# Status fase 1

8 Oktober 2026 — Implementasi fondasi selesai; siap ditinjau melalui demo lokal.

## Tersedia

- Halaman masuk, keluar, profil, dan beranda berbasis lingkup akun.
- Tujuh akun demo: admin BNPP, K/L, Pemda, darat, laut, udara, PLBN.
- Data tersimpan di SQLite lokal melalui D1; bukan localStorage.
- Admin dapat membuat/mengubah/menonaktifkan organisasi, akun, lokus, dan indikator.
- Empat domain acuan dan penugasan lokus per organisasi.
- Pemeriksaan akses di server, hash kata sandi, cookie HttpOnly/SameSite, batas percobaan login, dan audit.
- Navigasi fitur fase selanjutnya diberi status belum tersedia.

## Hasil pemeriksaan

Build aplikasi dan pemeriksaan TypeScript lulus. Sebanyak 21 kelompok pengujian API dan render server lulus: login benar/salah; mutasi lintas origin; sesi; akses tanpa login; pembatasan data semua kelompok akun; penolakan edit oleh pengguna; validasi; duplikasi; tambah/ubah organisasi; penugasan lokus; indikator; pembuatan dan penonaktifan akun; perlindungan akun admin sendiri; audit; seluruh halaman fase 1; serta logout.

Data sementara pengujian telah dibersihkan berdasarkan ID yang dibuat pengujian. Data acuan awal tetap tersedia: 7 organisasi, 7 akun, 4 domain, 6 lokus, 6 indikator.

## Batasan

- Pemeriksaan visual/interaksi melalui browser otomatis belum dilakukan. Auto-review gagal karena batas penggunaan layanan. Respons HTTP dan render server bukan bukti bahwa seluruh tampilan dan interaksi browser sudah sempurna.
- Alat WebMCP baca-ringkasan disediakan secara opsional; validasi pada browser pendukung belum tersedia. Ketiadaannya tidak memengaruhi fungsi aplikasi biasa.
- Belum ada program, kegiatan, pelaporan, dashboard capaian, atau evaluasi. Itu merupakan fase 2–5.
- Belum dipublikasikan. Login demo dan kata sandi contoh tidak boleh digunakan untuk data operasional.
- Pengujian beban, audit keamanan produksi, dan SSO instansi belum termasuk fase ini.

## Berikutnya

Pengguna meninjau fase 1, khususnya nama unit, akses pengguna, dan data acuan. Fase 2 dimulai setelah instruksi berikutnya: program dan kegiatan, jadwal, lokasi, indikator, target, serta anggaran simulasi.
