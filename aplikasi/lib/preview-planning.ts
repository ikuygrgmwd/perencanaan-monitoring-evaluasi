import type {Bootstrap} from './model';

// Fixture publik untuk preview; angka bukan capaian atau proyeksi resmi.
const plans = [
  {id:'PRG-01',locationId:'arunika',indicatorId:'sop',name:'Penguatan layanan terpadu PLBN',baseline:2,current:5,target:8,budget:2400,spent:1440,owner:'Tim layanan PLBN',action:'Harmonisasi SOP dan simulasi layanan lintas instansi',risk:'Dua SOP masih menunggu masukan lintas instansi.',recommendation:'Jadwalkan pembahasan bersama dan finalisasi SOP prioritas.'},
  {id:'PRG-02',locationId:'wana',indicatorId:'dokumen',name:'Pemutakhiran data batas darat',baseline:4,current:9,target:12,budget:1800,spent:1170,owner:'Tim batas darat',action:'Verifikasi dokumen dan rekonsiliasi data segmen batas',risk:'Tiga dokumen memerlukan verifikasi lanjutan.',recommendation:'Selesaikan verifikasi lapangan pada dokumen tersisa.'},
  {id:'PRG-03',locationId:'bahari',indicatorId:'dokumen',name:'Penguatan data batas laut',baseline:3,current:4,target:10,budget:1600,spent:640,owner:'Tim batas laut',action:'Sinkronisasi referensi dan peninjauan dokumen batas laut',risk:'Ketersediaan data pendukung belum merata.',recommendation:'Prioritaskan kelengkapan data dan koordinasi tim teknis.'},
  {id:'PRG-04',locationId:'angkasa',indicatorId:'dokumen',name:'Koordinasi ruang udara perbatasan',baseline:1,current:4,target:4,budget:900,spent:810,owner:'Tim batas udara',action:'Konsolidasi dokumen koordinasi pengelolaan ruang udara',risk:'Target dokumen tercapai; konsistensi pembaruan perlu dijaga.',recommendation:'Lakukan penjaminan mutu dan siapkan jadwal pembaruan.'},
  {id:'PRG-05',locationId:'tunas',indicatorId:'lokus',name:'Pendataan layanan dasar kawasan',baseline:0,current:0,target:1,budget:1200,spent:360,owner:'Tim pembangunan kawasan',action:'Survei kebutuhan dasar dan validasi profil Kawasan Tunas',risk:'Survei berjalan; pendataan lokus belum selesai.',recommendation:'Tuntaskan validasi hasil survei bersama pemerintah daerah.'},
  {id:'PRG-06',locationId:'nusa',indicatorId:'kajian',name:'Konektivitas ekonomi Koridor Nusa',baseline:0,current:2,target:3,budget:2100,spent:1260,owner:'Tim koridor ekonomi',action:'Pemetaan rantai pasok dan penyusunan kajian konektivitas',risk:'Satu kajian masih membutuhkan validasi pelaku usaha.',recommendation:'Adakan forum validasi dan finalisasi rekomendasi koridor.'},
];

export function planningFor(data:Bootstrap){
  return plans.filter(plan=>data.locations.some(location=>location.id===plan.locationId)).map(plan=>({
    ...plan,
    location:data.locations.find(location=>location.id===plan.locationId)!,
    indicator:data.indicators.find(indicator=>indicator.id===plan.indicatorId)!,
    progress:Math.round(plan.current/plan.target*100),
  }));
}
export type PreviewPlan=ReturnType<typeof planningFor>[number];
export const progressLabel=(progress:number)=>progress>=100?'Tercapai':progress>=60?'Sesuai rencana':'Perlu perhatian';
export const rupiah=(millions:number)=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(millions*1_000_000);
