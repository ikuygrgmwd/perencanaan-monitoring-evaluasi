import type {Actor, Bootstrap, Domain, Indicator, Location, Organization, User} from './model';

// Seluruh data ini publik dan fiktif; bukan sumber data operasional.
export const DEMO_PASSWORD = 'DemoBnpp2027!';
export const demoAccounts = [
  {key:'admin',label:'Admin BNPP',org:'bnpp',name:'Admin BNPP'},
  {key:'kl',label:'K/L',org:'kl',name:'Operator K/L'},
  {key:'pemda',label:'Pemda',org:'pemda',name:'Operator Pemda'},
  {key:'darat',label:'Batas darat',org:'darat',name:'Operator Batas Darat'},
  {key:'laut',label:'Batas laut',org:'laut',name:'Operator Batas Laut'},
  {key:'udara',label:'Batas udara',org:'udara',name:'Operator Batas Udara'},
  {key:'plbn',label:'PLBN',org:'plbn',name:'Operator PLBN'},
] as const;

const organizations: Organization[] = [
  {id:'bnpp',code:'BNPP',name:'BNPP — Administrator',kind:'BNPP',region:'Nasional',active:1},
  {id:'kl',code:'KL-01',name:'K/L Infrastruktur — Simulasi',kind:'KL',region:'Nasional',active:1},
  {id:'pemda',code:'PEMDA-01',name:'Pemda Kawasan Perbatasan — Simulasi',kind:'PEMDA',region:'Kawasan Arunika',active:1},
  {id:'darat',code:'UNIT-DARAT',name:'Unit Batas Darat — Simulasi',kind:'UNIT',region:'Batas darat',active:1},
  {id:'laut',code:'UNIT-LAUT',name:'Unit Batas Laut — Simulasi',kind:'UNIT',region:'Batas laut',active:1},
  {id:'udara',code:'UNIT-UDARA',name:'Unit Batas Udara — Simulasi',kind:'UNIT',region:'Ruang udara perbatasan',active:1},
  {id:'plbn',code:'PLBN-01',name:'PLBN Arunika — Simulasi',kind:'PLBN',region:'Kawasan Arunika',active:1},
];
const users: User[] = demoAccounts.map(account=>({
  id:`user-${account.key}`,name:account.name,email:`${account.key}@demo.bnpp.test`,
  role:account.key==='admin'?'admin':'user',org_id:account.org,
  org_name:organizations.find(org=>org.id===account.org)!.name,active:1,
}));
const domains: Domain[] = [
  {id:'bwn',code:'D01',name:'Batas Wilayah Negara',description:'Kepastian, pemeliharaan, dan koordinasi pengelolaan batas wilayah negara.'},
  {id:'gerbang',code:'D02',name:'Gerbang Negara dan PLBN',description:'Keterpaduan layanan, pengawasan, serta konektivitas gerbang negara.'},
  {id:'kawasan',code:'D03',name:'Kawasan Perbatasan',description:'Kebutuhan layanan dasar dan pembangunan berbasis kawasan.'},
  {id:'koridor',code:'D04',name:'Koridor Ekonomi Perbatasan',description:'Keterhubungan produksi, pengolahan, logistik, dan pasar.'},
];
const description='Lokus fiktif untuk demonstrasi. Tidak mewakili lokasi, batas, atau capaian resmi.';
const locations: Location[] = [
  {id:'arunika',code:'LOK-01',name:'PLBN Arunika',region:'Kawasan Arunika',domain_id:'gerbang',org_ids:['kl','pemda','plbn'],description,active:1},
  {id:'wana',code:'LOK-02',name:'Segmen Batas Wana',region:'Kawasan Wana',domain_id:'bwn',org_ids:['darat'],description,active:1},
  {id:'bahari',code:'LOK-03',name:'Kawasan Pesisir Bahari',region:'Kawasan Bahari',domain_id:'bwn',org_ids:['laut'],description,active:1},
  {id:'angkasa',code:'LOK-04',name:'Lokus Koordinasi Angkasa',region:'Kawasan Angkasa',domain_id:'bwn',org_ids:['udara'],description,active:1},
  {id:'tunas',code:'LOK-05',name:'Kawasan Tunas',region:'Kawasan Arunika',domain_id:'kawasan',org_ids:['pemda','kl'],description,active:1},
  {id:'nusa',code:'LOK-06',name:'Koridor Nusa',region:'Kawasan Nusa',domain_id:'koridor',org_ids:['kl'],description,active:1},
];
const indicators: Indicator[] = [
  {id:'dokumen',code:'IND-01',name:'Dokumen data batas yang ditinjau',unit:'Dokumen',domain_id:'bwn',definition:'Jumlah dokumen simulasi yang selesai ditinjau sesuai daftar pemeriksaan.',frequency:'Triwulanan',active:1},
  {id:'sop',code:'IND-02',name:'SOP layanan yang ditinjau',unit:'SOP',domain_id:'gerbang',definition:'Jumlah SOP simulasi yang selesai ditinjau; bukan penilaian mutu layanan.',frequency:'Triwulanan',active:1},
  {id:'petugas',code:'IND-03',name:'Petugas mengikuti pelatihan',unit:'Orang',domain_id:'gerbang',definition:'Jumlah peserta unik yang mengikuti pelatihan simulasi.',frequency:'Triwulanan',active:1},
  {id:'lokus',code:'IND-04',name:'Lokus kebutuhan dasar yang didata',unit:'Lokus',domain_id:'kawasan',definition:'Jumlah lokus unik dengan pendataan kebutuhan dasar selesai.',frequency:'Triwulanan',active:1},
  {id:'kajian',code:'IND-05',name:'Kajian konektivitas yang diselesaikan',unit:'Kajian',domain_id:'koridor',definition:'Jumlah kajian simulasi yang selesai sesuai ruang lingkup kegiatan.',frequency:'Triwulanan',active:1},
  {id:'usaha',code:'IND-06',name:'Usaha yang mendapat pendampingan',unit:'Usaha',domain_id:'koridor',definition:'Jumlah usaha unik yang mendapat pendampingan simulasi.',frequency:'Triwulanan',active:1},
];

export function readDemoData(accountKey: string): Bootstrap | null {
  const account=demoAccounts.find(item=>item.key===accountKey);
  if(!account)return null;
  const user=users.find(item=>item.id===`user-${account.key}`)!;
  const org=organizations.find(item=>item.id===user.org_id)!;
  const actor: Actor={id:user.id,name:user.name,email:user.email,role:user.role,org_id:org.id,org_name:org.name,org_kind:org.kind};
  const admin=actor.role==='admin';
  return {
    actor,organizations:admin?organizations:organizations.filter(item=>item.id===org.id),
    users:admin?users:[user],domains,indicators,
    locations:locations.filter(item=>admin||item.org_ids.includes(org.id)),
    audits:[
      {id:'contoh-tinjau',action:'Meninjau',entity:'lokus',summary:'Contoh aktivitas: meninjau lokus penugasan',created_at:1791421200000,actor_name:user.name},
      {id:'contoh-profil',action:'Meninjau',entity:'profil',summary:'Contoh aktivitas: meninjau profil organisasi',created_at:1791417600000,actor_name:user.name},
      {id:'contoh-data',action:'Menyiapkan',entity:'seed',summary:'Contoh aktivitas: data acuan simulasi disiapkan',created_at:1791331200000,actor_name:'Admin BNPP'},
    ],
  };
}
