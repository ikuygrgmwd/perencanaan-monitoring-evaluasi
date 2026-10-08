# PRD dan cakupan demo aplikasi perencanaan monitoring dan evaluasi BWN KP

Versi 0.1 — 8 Oktober 2026

Status: Draf untuk ditinjau. Belum disetujui untuk implementasi.

Dokumen ini menerjemahkan kebutuhan pengguna dan referensi BWN–KP menjadi rancangan demo fungsional. Semua ketentuan berlabel usulan memerlukan persetujuan pengguna. Dokumen ini belum memilih teknologi atau menetapkan struktur organisasi resmi.

## 1 Tujuan produk

Demo memperlihatkan satu siklus kerja yang tersambung: pengguna membuat program dan kegiatan, menetapkan target, melaporkan realisasi dan bukti, kemudian BNPP memantau, mengevaluasi, dan mengawal tindak lanjut.

Visi produk yang diusulkan adalah menyediakan satu tempat untuk menelusuri hubungan antara rencana, lokasi, penanggung jawab, pelaksanaan, dan hasil pengelolaan perbatasan.

Tujuan demo adalah memvalidasi alur kerja dan kebutuhan dengan calon pengguna. Demo belum menjadi sumber pelaporan resmi dan belum membuktikan kesiapan operasional produksi.

## 2 Dasar kebutuhan dan status keputusan

| ID | Kebutuhan atau keputusan | Status |
| --- | --- | --- |
| K01 | Website mencakup perencanaan, monitoring, dashboard, dan evaluasi | Dikonfirmasi pengguna |
| K02 | BNPP sebagai admin | Dikonfirmasi pengguna |
| K03 | K/L dan Pemda sebagai pengguna | Dikonfirmasi pengguna |
| K04 | Keasdepan/unit terkait batas darat, batas laut dan udara, serta PLBN menjadi pengguna | Kelompok pengguna dikonfirmasi; nama dan pengelompokan unit belum ditetapkan |
| K05 | Hasil tahap awal berupa demo fungsional | Dikonfirmasi pengguna |
| K06 | Program dan kegiatan dibuat di dalam aplikasi | Dikonfirmasi pengguna |
| K07 | Belum tersedia data awal operasional; gunakan data dummy yang relevan | Dikonfirmasi pengguna |
| K08 | Demo menggunakan akun, data, dan berkas simulasi | Usulan pelaksanaan K05 dan K07 |
| K09 | Hak akses pengguna dibatasi berdasarkan organisasi/unit dan penugasan | Usulan |
| K10 | BNPP memverifikasi laporan sebelum masuk rekap terverifikasi | Usulan |
| K11 | Demo berfokus pada periode contoh 2027 | Usulan |

Referensi sumber adalah LAMPIRAN - lampiran.docx, Desain Besar PBWN-KP 2026-2045_EDIT 24092026_2106.docx, dan Final_Transformasi BWN-KP.pptx. Penyebutan kebijakan dalam referensi tidak diperlakukan sebagai instruksi teknis atau konfirmasi bahwa setiap gagasan harus menjadi fitur MVP.

Empat domain dari referensi adalah Batas Wilayah Negara, Gerbang Negara dan PLBN, Kawasan Perbatasan, serta Koridor Ekonomi Perbatasan. Organisasi/unit pengguna merupakan dimensi berbeda dari domain. Penyebutan unit yang menangani udara tidak otomatis membentuk domain kelima.

## 3 Masalah dan nilai produk yang perlu divalidasi

Hipotesis masalah berikut berasal dari konteks referensi, bukan hasil wawancara pengguna operasional:

- Rencana, laporan, dan tindak lanjut sulit ditelusuri dalam satu alur.
- Pihak pengoordinasi membutuhkan rekap lintas organisasi dan lokasi.
- Penyelesaian kegiatan belum selalu menjelaskan perubahan hasil di lokasi.
- Kendala membutuhkan penanggung jawab dan tenggat tindak lanjut yang jelas.

Demo dinilai berguna bila calon pengguna dapat melihat bagaimana setiap masalah tersebut ditangani dan menunjukkan bagian alur yang perlu dikoreksi.

## 4 Pengguna dan kewenangan awal

Seluruh matriks berikut merupakan usulan, kecuali penetapan BNPP sebagai admin dan kelompok pengguna yang telah dikonfirmasi.

| Kelompok | Tujuan utama | Akses yang diusulkan |
| --- | --- | --- |
| Admin BNPP | Mengelola demo, mengonsolidasikan rencana, memeriksa laporan, dan mengevaluasi capaian | Mengelola akun, unit, lokasi, dan indikator; melihat seluruh data demo; memverifikasi laporan; menyusun evaluasi dan tindak lanjut |
| Pengguna K/L | Merencanakan dan melaporkan pekerjaan organisasinya | Membuat program/kegiatan milik organisasi, menetapkan target, mengirim laporan, dan memperbarui tindak lanjut yang ditugaskan |
| Pengguna Pemda | Merencanakan dan melaporkan pekerjaan daerahnya | Fungsi serupa pengguna K/L dengan pembatasan organisasi dan lokasi penugasan |
| Pengguna keasdepan/unit teknis | Mengelola pekerjaan sesuai lingkup penugasan | Mengelola dan melaporkan data dalam unit atau penugasan yang diberikan |
| Pengguna PLBN | Mengelola kegiatan dan pelaporan pada lokus PLBN | Mengelola dan melaporkan kegiatan yang ditugaskan pada PLBN terkait |

Pengguna K/L, Pemda, dan unit teknis tidak otomatis memperoleh akses ke seluruh data organisasi lain. Penugasan bersama harus diberikan secara eksplisit. Admin tidak mengubah laporan terverifikasi tanpa jejak perubahan.

Untuk MVP, diusulkan dua peran aplikasi, yaitu admin dan pengguna, ditambah atribut organisasi/unit serta penugasan. Peran pimpinan terpisah dan persetujuan berjenjang belum termasuk cakupan.

## 5 Batas dan bentuk MVP

MVP adalah demo dengan penyimpanan data yang bertahan setelah halaman dimuat ulang, akun contoh dengan pembatasan akses, formulir yang berfungsi, serta rekap yang dihitung dari data tersimpan.

Alur utama yang diusulkan:

1. Admin menyiapkan akun, organisasi/unit, lokasi, dan indikator simulasi.
2. Pengguna membuat program dan kegiatan, melengkapi penanggung jawab, lokasi, jadwal, indikator, target, serta anggaran contoh.
3. Pengguna mengaktifkan rencana yang telah lengkap. Aktivasi ini adalah status internal demo, bukan pengesahan administratif resmi.
4. Pengguna mengisi laporan periode, realisasi indikator, kendala, dan bukti, lalu mengirimkannya.
5. Admin memverifikasi laporan atau mengembalikannya dengan catatan perbaikan.
6. Dashboard menampilkan rekap terverifikasi dan daftar laporan yang menunggu pemeriksaan secara terpisah.
7. Admin menyusun evaluasi, menetapkan tindak lanjut, dan memeriksa hasil penyelesaiannya.

Usulan alur verifikasi ini tidak berarti BNPP telah ditetapkan sebagai pihak pengesah substantif seluruh pekerjaan instansi. Kesesuaiannya perlu dikonfirmasi sebelum penggunaan operasional.

## 6 Kebutuhan fungsional

| ID | Kebutuhan MVP yang diusulkan | Kriteria penerimaan |
| --- | --- | --- |
| FR01 | Masuk dan keluar menggunakan akun demo | Setiap kelompok pengguna memiliki akun contoh; akun yang keluar tidak dapat membuka halaman terlindungi |
| FR02 | Pembatasan akses berdasarkan organisasi/unit dan penugasan | Pengguna tidak dapat membaca atau mengubah data organisasi lain melalui halaman maupun permintaan langsung tanpa izin |
| FR03 | Pengelolaan data acuan | Admin dapat menambah dan mengubah organisasi/unit, lokasi, domain, dan indikator; referensi yang telah digunakan tidak dapat dihapus sembarangan |
| FR04 | Pembuatan program | Program menyimpan kode, nama, tujuan, pemilik, periode, domain terkait, dan status; perubahan bertahan setelah halaman dimuat ulang |
| FR05 | Pembuatan kegiatan | Setiap kegiatan memiliki satu program induk, satu pemilik utama, lokasi, penanggung jawab, jadwal, indikator, target, dan anggaran contoh |
| FR06 | Pelaporan realisasi berkala | Pengguna menyimpan draf dan mengirim laporan per kegiatan/periode beserta realisasi, kendala, serta bukti simulasi |
| FR07 | Pemeriksaan laporan | Admin memverifikasi atau mengembalikan laporan dengan catatan; pengguna dapat memperbaiki dan mengirim ulang laporan yang dikembalikan |
| FR08 | Dashboard | Filter periode, organisasi, domain, dan lokasi memengaruhi rekap; angka berasal dari data tersimpan; data kosong dibedakan dari nilai nol |
| FR09 | Detail kegiatan dan lokus | Pengguna yang berwenang dapat menelusuri rencana, target, laporan, bukti, isu, evaluasi, dan tindak lanjut yang terkait |
| FR10 | Isu dan kendala | Isu memiliki deskripsi, lokasi/kegiatan terkait, pemilik, prioritas, tenggat, dan status; prioritas ditentukan pengguna, bukan skor otomatis yang belum disepakati |
| FR11 | Evaluasi dan tindak lanjut | Admin mencatat perbandingan target dan realisasi, analisis, serta rekomendasi; tindak lanjut memiliki penanggung jawab, tenggat, dan catatan penyelesaian |
| FR12 | Riwayat aktivitas penting | Sistem mencatat pembuat, pengubah, pengirim, pemeriksa, dan waktu tindakan; pengguna biasa tidak dapat mengedit riwayat |

Setiap kegiatan dapat terkait beberapa domain/lokus, tetapi tetap memiliki identitas dan pemilik utama tunggal agar rekap tidak menghitungnya dua kali. Pihak pendukung tidak otomatis memperoleh hak edit.

## 7 Aturan data yang diusulkan

- Kode program dan kegiatan harus unik; kegiatan selalu mengacu pada program yang tersedia.
- Tanggal selesai tidak boleh mendahului tanggal mulai. Jadwal kegiatan harus berada dalam periode program, atau pengguna mendapat penjelasan untuk memperbaikinya.
- Target, realisasi, dan anggaran simulasi harus memakai satuan yang jelas; kolom wajib diperiksa sebelum pengiriman.
- Data belum diisi disimpan sebagai belum tersedia, bukan otomatis nol.
- Nilai nol tetap dianggap data sah bila sesuai definisi indikator.
- Setiap indikator menyimpan definisi, satuan, sumber, frekuensi, dan jenis pelaporan. Indikator hasil tidak otomatis dihitung dari persentase anggaran terserap.
- Untuk menyederhanakan demo, realisasi numerik MVP menggunakan nilai kumulatif pada akhir periode. Rekap mengambil laporan terverifikasi terakhir dalam periode terpilih, bukan menjumlahkan seluruh snapshot bulanan.
- Contoh perhitungan capaian hanya digunakan untuk indikator numerik positif dengan aturan semakin tinggi semakin baik dan target lebih dari nol. Target nol, indikator yang semakin rendah semakin baik, serta indikator kualitatif tidak memakai rumus tersebut secara otomatis.
- Capaian antarindikator dengan satuan berbeda tidak dirata-ratakan menjadi satu skor kinerja umum.
- Laporan terverifikasi dikunci. Koreksi diajukan sebagai revisi yang menyimpan versi sebelumnya, lalu diperiksa ulang.
- Target pada rencana yang sudah memiliki laporan tidak ditimpa diam-diam. Perubahan target mencatat alasan dan versi; laporan tetap mengacu pada target yang berlaku saat laporan dibuat.
- Rekap anggaran dihitung dari kegiatan unik. Nominal yang muncul di beberapa kategori tidak dijumlahkan kembali sebagai total nasional.
- Penutupan tindak lanjut memerlukan catatan penyelesaian; hasil penutupan dapat diperiksa admin.

Rumus indeks resmi, bobot penilaian, ambang warna capaian, dan status ketercapaian kebijakan belum ditetapkan. Demo dapat menampilkan target dan realisasi apa adanya tanpa menyatakan skor resmi.

## 8 Kebutuhan nonfungsional

Seluruh target berikut adalah usulan penerimaan demo, bukan komitmen layanan produksi.

| ID | Kebutuhan | Target dan cara pemeriksaan |
| --- | --- | --- |
| NFR01 | Keamanan akses | Pemeriksaan izin di sisi server pada setiap operasi terlindungi, termasuk akses berkas; menyembunyikan tombol saja tidak cukup |
| NFR02 | Keamanan akun dan berkas | Kredensial tidak disimpan sebagai teks biasa; rahasia berada di konfigurasi lingkungan; unggahan dibatasi PDF/JPG/PNG maksimal 5 MB dengan pemeriksaan tipe berkas |
| NFR03 | Integritas penyimpanan | Pengiriman berulang tidak membuat laporan ganda; kegagalan simpan tidak menghasilkan status sukses palsu; pengguna menerima pesan yang dapat ditindaklanjuti |
| NFR04 | Kemudahan penggunaan | Label dan pesan berbahasa Indonesia, validasi dekat kolom terkait, serta kondisi loading, kosong, gagal, dan berhasil yang jelas |
| NFR05 | Aksesibilitas dasar | Alur utama dapat digunakan dengan keyboard, setiap input memiliki label, dan status tidak disampaikan melalui warna saja |
| NFR06 | Responsivitas | Alur utama berfungsi pada desktop dan ponsel; tabel lebar memiliki tampilan atau mekanisme gulir yang dapat digunakan |
| NFR07 | Performa demo | Dengan data seed yang disepakati dan lingkungan uji yang dicatat, halaman daftar dan dashboard siap digunakan dalam target 3 detik pada sedikitnya 9 dari 10 percobaan setelah pemanasan |
| NFR08 | Keterlacakan | Tindakan penting merekam pelaku, waktu, entitas, dan perubahan status tanpa menyimpan kredensial dalam log |
| NFR09 | Kemudahan pemeliharaan | Fitur dipisahkan menurut tanggung jawab, aturan perhitungan terpusat, serta petunjuk menjalankan dan menguji demo tersedia |
| NFR10 | Identitas simulasi | Semua halaman utama dan keluaran laporan menampilkan bahwa data bersifat simulasi dan tidak untuk pelaporan resmi |

## 9 Prioritas MoSCoW dan ketergantungan

| Prioritas | Fitur |
| --- | --- |
| Must have | Akun demo dan pembatasan akses; data acuan; program dan kegiatan; target; laporan dan bukti; pemeriksaan laporan; dashboard; isu sederhana; evaluasi dan tindak lanjut; riwayat penting; data dummy |
| Should have | Ekspor CSV/halaman cetak; pencarian dan filter lanjutan; penanda tenggat; notifikasi di dalam aplikasi |
| Could have | Peta lokasi sederhana menggunakan koordinat terverifikasi; timeline kegiatan; lampiran tambahan; perbandingan antarperiode |
| Tidak termasuk versi ini | Integrasi sistem pemerintah; SSO instansi; perhitungan indeks resmi tanpa metodologi; prediksi AI; persetujuan organisasi berlapis; data operasional sensitif; portal publik; aplikasi mobile native; operasi offline |

Fitur inti adalah perencanaan, pelaporan, monitoring, evaluasi, dan tindak lanjut. Akun, data acuan, berkas, serta riwayat merupakan fitur pendukung yang wajib agar alur inti dapat dipercaya dalam demo.

Urutan ketergantungan produk: akun dan organisasi → data acuan → program dan kegiatan → target → laporan dan bukti → pemeriksaan → rekap dashboard → evaluasi dan tindak lanjut. Isu dapat dicatat sejak perencanaan. Dashboard awal boleh menampilkan rencana sebelum ada laporan, dengan keadaan kosong yang jelas pada bagian realisasi.

Integrasi, SSO, pengukuran resmi, dan analitik lanjutan merupakan kandidat pengembangan berikutnya; statusnya belum menjadi komitmen fitur.

## 10 Rancangan data dummy

Usulan paket awal: 4 program, 12 kegiatan, 6 lokus fiktif, dan 24 catatan laporan dalam periode contoh Januari–Juni 2027. Jumlah akun mengikuti pengelompokan unit yang nanti disetujui. Semua nama orang, angka, berkas, dan capaian dibuat untuk simulasi.

| Program simulasi | Contoh kegiatan | Contoh indikator demonstrasi |
| --- | --- | --- |
| Penguatan Pengelolaan Batas Wilayah Negara | Pendataan sarana batas darat; pemutakhiran informasi batas laut; penyusunan bahan koordinasi informasi terkait ruang udara perbatasan | Jumlah dokumen/data yang diperiksa sesuai definisi contoh |
| Peningkatan Layanan Gerbang Negara dan PLBN | Penataan SOP; pelatihan petugas; perbaikan fasilitas layanan | Jumlah SOP yang ditinjau, petugas yang mengikuti pelatihan, atau fasilitas yang diselesaikan |
| Penguatan Kawasan Perbatasan | Pendataan kebutuhan layanan dasar; penyusunan rencana akses; pendampingan pelaksana daerah | Jumlah lokasi yang didata atau dokumen rencana yang diselesaikan |
| Pengembangan Koridor Ekonomi Perbatasan | Pemetaan komoditas; kajian konektivitas; pendampingan usaha | Jumlah kajian atau usaha yang didampingi |

Pengelompokan ini membantu demonstrasi empat domain, bukan menyatakan bahwa kegiatan tersebut merupakan program resmi atau seluruhnya menjadi kewenangan BNPP. Contoh terkait udara tidak mengasumsikan pengelolaan operasional penerbangan oleh aplikasi.

Data mencakup kegiatan belum dimulai, berjalan, terlambat, selesai, dan belum memiliki laporan. Laporan mencakup draf, menunggu pemeriksaan, dikembalikan, serta terverifikasi. Disediakan contoh capaian tepat target, di bawah target, melampaui target, dan belum tersedia.

Nilai baseline dan target dibuat sebagai angka simulasi dengan satuan konsisten. Nama instansi/unit menggunakan label generik sampai nomenklatur disepakati. Lokus fiktif tidak diberi koordinat yang seolah-olah merupakan lokasi nyata.

## 11 Metrik keberhasilan dan penerimaan demo

| ID | Ukuran keberhasilan yang diusulkan | Bukti penerimaan |
| --- | --- | --- |
| AC01 | Satu siklus utama dapat diselesaikan | Program/kegiatan dibuat, laporan dikirim, admin memverifikasi, dashboard berubah, evaluasi dibuat, dan tindak lanjut diselesaikan tanpa mengedit database secara manual |
| AC02 | Data bertahan | Catatan yang dibuat tetap tersedia setelah reload, keluar, dan masuk kembali |
| AC03 | Hak akses bekerja | Setiap kelompok akun diuji; percobaan akses data organisasi lain yang tidak ditugaskan ditolak termasuk melalui permintaan langsung |
| AC04 | Angka dapat ditelusuri | Rekap dashboard cocok dengan catatan sumber pada dataset uji, tidak menghitung ganda, dan dapat ditelusuri ke rincian |
| AC05 | Koreksi dapat diperagakan | Laporan dikembalikan, diperbaiki, dikirim ulang, dan diverifikasi dengan jejak proses lengkap |
| AC06 | Perubahan tidak merusak riwayat | Revisi laporan/target mempertahankan versi yang telah dipakai dalam pelaporan sebelumnya |
| AC07 | Kondisi gagal tertangani | Pengguna mendapat pesan jelas untuk kolom wajib kosong, target tidak valid, berkas ditolak, dan penyimpanan gagal |
| AC08 | Demo jelas sebagai simulasi | Halaman dan ekspor memuat label simulasi; tidak ada klaim capaian resmi dari data dummy |
| AC09 | Alur dapat dipahami calon pengguna | Perwakilan admin dan pengguna menyelesaikan skenario utama dengan panduan singkat; kesulitan dicatat sebagai bahan revisi |

Jumlah pengguna serentak, target kapasitas produksi, biaya, dan tenggat pembangunan belum ditentukan. Keberhasilan demo tidak diukur sebagai bukti peningkatan kinerja pembangunan nyata.

## 12 Asumsi batasan dan keputusan terbuka

- Demo menggunakan data simulasi dan tidak mengambil data dari sistem eksternal.
- Jadwal presentasi, anggaran layanan, lokasi hosting, dan apakah demo harus diakses melalui internet belum diketahui. Keputusan tersebut dibahas sebelum rancangan teknis disetujui.
- Sumber data dapat diperluas kemudian, tetapi integrasi belum dirancang sebagai kewajiban MVP.
- Target perencanaan dibuat di aplikasi; pengesahan resmi di luar demo belum dimodelkan.
- Usulan pemeriksaan satu tingkat oleh BNPP perlu ditinjau pengguna.
- Perlu dipastikan apakah batas laut dan udara adalah satu kelompok unit atau dua kelompok terpisah. Nama unit resmi dan hubungan PLBN dengan unit induk tetap terbuka.
- Status keterlambatan dapat ditentukan dari tenggat dan penyelesaian. Penilaian efektivitas atau dampak tetap berupa evaluasi yang didukung data, bukan kesimpulan otomatis dari kegiatan selesai.

## 13 Gerbang persetujuan dan tahap berikutnya

Yang diminta untuk ditinjau sekarang adalah tujuan demo, batas MVP, usulan pembatasan akses, alur pemeriksaan laporan, aturan dasar data, serta paket data dummy.

Setelah disetujui, tahap berikutnya adalah persona dan skenario pengguna, alur langkah demi langkah beserta kasus khusus, sitemap, tanggung jawab halaman, matriks akses rinci, dan spesifikasi UI/UX. Pemilihan teknologi, skema database, roadmap, prompt coding, serta rencana pengujian dan deployment mengikuti pada tahap berikutnya.

Belum ada persetujuan implementasi. Tidak ada kode aplikasi yang dibuat pada tahap ini.
