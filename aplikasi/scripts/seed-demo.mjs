import {pbkdf2Sync,randomBytes} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
const quote=v=>typeof v==='number'?String(v):`'${String(v).replaceAll("'","''")}'`;
const statements=[];
function insert(table,record){statements.push(`INSERT OR IGNORE INTO ${table} (${Object.keys(record).join(',')}) VALUES (${Object.values(record).map(quote).join(',')});`);}
const orgs=[
 ['bnpp','BNPP','BNPP — Administrator','BNPP','Nasional'],
 ['kl','KL-01','K/L Infrastruktur — Simulasi','KL','Nasional'],
 ['pemda','PEMDA-01','Pemda Kawasan Perbatasan — Simulasi','PEMDA','Kawasan Arunika'],
 ['darat','UNIT-DARAT','Unit Batas Darat — Simulasi','UNIT','Batas darat'],
 ['laut','UNIT-LAUT','Unit Batas Laut — Simulasi','UNIT','Batas laut'],
 ['udara','UNIT-UDARA','Unit Batas Udara — Simulasi','UNIT','Ruang udara perbatasan'],
 ['plbn','PLBN-01','PLBN Arunika — Simulasi','PLBN','Kawasan Arunika'],
];
for(const [id,code,name,kind,region] of orgs)insert('organizations',{id,code,name,kind,region,active:1});
for(const [id,,,kind] of orgs){
 const key=id==='bnpp'?'admin':id;const salt=randomBytes(16).toString('hex');
 const hash=pbkdf2Sync('DemoBnpp2027!',salt,100000,32,'sha256').toString('hex');
 insert('users',{id:`user-${key}`,org_id:id,name:id==='bnpp'?'Admin BNPP':`Operator ${kind==='UNIT'?`Batas ${id}`:id.toUpperCase()}`,email:`${key}@demo.bnpp.test`,role:id==='bnpp'?'admin':'user',password_hash:`pbkdf2$100000$${salt}$${hash}`,active:1});
}
const domains=[
 ['bwn','D01','Batas Wilayah Negara','Kepastian, pemeliharaan, dan koordinasi pengelolaan batas wilayah negara.'],
 ['gerbang','D02','Gerbang Negara dan PLBN','Keterpaduan layanan, pengawasan, serta konektivitas gerbang negara.'],
 ['kawasan','D03','Kawasan Perbatasan','Kebutuhan layanan dasar dan pembangunan berbasis kawasan.'],
 ['koridor','D04','Koridor Ekonomi Perbatasan','Keterhubungan produksi, pengolahan, logistik, dan pasar.'],
];
for(const [id,code,name,description] of domains)insert('domains',{id,code,name,description});
const locations=[
 ['arunika','LOK-01','PLBN Arunika','Kawasan Arunika','gerbang',['kl','pemda','plbn']],
 ['wana','LOK-02','Segmen Batas Wana','Kawasan Wana','bwn',['darat']],
 ['bahari','LOK-03','Kawasan Pesisir Bahari','Kawasan Bahari','bwn',['laut']],
 ['angkasa','LOK-04','Lokus Koordinasi Angkasa','Kawasan Angkasa','bwn',['udara']],
 ['tunas','LOK-05','Kawasan Tunas','Kawasan Arunika','kawasan',['pemda','kl']],
 ['nusa','LOK-06','Koridor Nusa','Kawasan Nusa','koridor',['kl']],
];
for(const [id,code,name,region,domain_id,orgIds] of locations){insert('locations',{id,code,name,region,domain_id,description:'Lokus fiktif untuk demonstrasi. Tidak mewakili lokasi, batas, atau capaian resmi.',active:1});for(const org_id of orgIds)insert('assignments',{org_id,location_id:id});}
const indicators=[
 ['dokumen','IND-01','Dokumen data batas yang ditinjau','Dokumen','bwn','Jumlah dokumen simulasi yang selesai ditinjau sesuai daftar pemeriksaan.'],
 ['sop','IND-02','SOP layanan yang ditinjau','SOP','gerbang','Jumlah SOP simulasi yang selesai ditinjau; bukan penilaian mutu layanan.'],
 ['petugas','IND-03','Petugas mengikuti pelatihan','Orang','gerbang','Jumlah peserta unik yang mengikuti pelatihan simulasi pada periode pelaporan.'],
 ['lokus','IND-04','Lokus kebutuhan dasar yang didata','Lokus','kawasan','Jumlah lokus unik dengan pendataan kebutuhan dasar selesai.'],
 ['kajian','IND-05','Kajian konektivitas yang diselesaikan','Kajian','koridor','Jumlah kajian simulasi yang selesai sesuai ruang lingkup kegiatan.'],
 ['usaha','IND-06','Usaha yang mendapat pendampingan','Usaha','koridor','Jumlah usaha unik yang mendapat pendampingan simulasi.'],
];
for(const [id,code,name,unit,domain_id,definition] of indicators)insert('indicators',{id,code,name,unit,domain_id,definition,frequency:'Triwulanan',active:1});
insert('audits',{id:'seed-fase-1',actor_id:'user-admin',org_id:'bnpp',action:'Menyiapkan',entity:'seed',entity_id:'fase-1',summary:'Data acuan simulasi fase 1 disiapkan',created_at:Date.now()});
mkdirSync('.sites-runtime',{recursive:true});writeFileSync('.sites-runtime/seed-demo.sql',statements.join('\n'));
console.log('Seed simulasi disiapkan: 7 organisasi, 7 akun, 4 domain, 6 lokus, 6 indikator.');
