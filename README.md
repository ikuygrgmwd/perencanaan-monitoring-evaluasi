# Ruang Perbatasan — BNPP

Preview website statis perencanaan, monitoring, dan evaluasi BWN–KP dengan login demo dan data dummy. Tidak memerlukan database atau konfigurasi environment.

```powershell
cd aplikasi
npm ci
npm run build
npm run preview
```

Buka http://localhost:3000/login/. Akun admin: **admin@demo.bnpp.test**, kata sandi: **DemoBnpp2027!**. Enam peran lain dapat dipilih pada halaman login.

- Petunjuk dan akun demo: [aplikasi/README.md](aplikasi/README.md)
- Status dan verifikasi: [aplikasi/STATUS.md](aplikasi/STATUS.md)
- Keputusan dan rencana: [perencanaan/](perencanaan/)

Login hanya simulasi untuk preview. Fitur CRUD ditunda; program, monitoring, dashboard capaian, dan evaluasi akan dikembangkan bertahap. Dokumen referensi asli, database lokal, hasil build, dan kredensial tidak disertakan dalam repositori.
