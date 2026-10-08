import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const base=process.env.DEMO_TEST_URL||'http://127.0.0.1:5173';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw new Error('Pengujian hanya untuk demo lokal.');
const checks=[];const cleanup={users:[],organizations:[],locations:[],indicators:[]};
async function call(path,{method='GET',body,cookie='',origin=base}={}){
 const r=await fetch(base+path,{method,redirect:'manual',headers:{...(method!=='GET'?{'Content-Type':'application/json',Origin:origin}:{}),...(cookie?{Cookie:cookie}:{})},body:body?JSON.stringify(body):undefined});
 const raw=await r.text();let data;try{data=JSON.parse(raw);}catch{data=raw;}return {status:r.status,data,cookie:r.headers.get('set-cookie'),headers:r.headers};
}
function pass(name){checks.push(name);console.log('LULUS:',name);}
async function login(key){const r=await call('/api/login',{method:'POST',body:{email:`${key}@demo.bnpp.test`,password:'DemoBnpp2027!'}});assert.equal(r.status,200,JSON.stringify(r.data));return r.cookie.split(';')[0];}
const suffix=Date.now().toString(36).toUpperCase();let admin='';
try{
 assert.equal((await call('/api/bootstrap')).status,401);pass('API terlindungi menolak pengunjung tanpa sesi');
 const invalid=await call('/api/login',{method:'POST',body:{email:'admin@demo.bnpp.test',password:'salah'}});assert.equal(invalid.status,401);pass('Kata sandi salah ditolak');
 const cross=await call('/api/login',{method:'POST',origin:'https://example.org',body:{email:'admin@demo.bnpp.test',password:'DemoBnpp2027!'}});assert.equal(cross.status,403);pass('Permintaan mutasi lintas origin ditolak');
 const auth=await call('/api/login',{method:'POST',body:{email:'admin@demo.bnpp.test',password:'DemoBnpp2027!'}});assert.equal(auth.status,200,JSON.stringify(auth.data));assert.match(auth.cookie,/HttpOnly/);assert.match(auth.cookie,/SameSite=Strict/);admin=auth.cookie.split(';')[0];pass('Login admin dan atribut cookie sesi');
 const full=await call('/api/bootstrap',{cookie:admin});assert.equal(full.status,200);assert.equal(full.data.actor.role,'admin');assert.ok(full.data.organizations.length>=7);assert.equal(full.data.domains.length,4);assert.ok(full.data.locations.length>=6);assert.ok(!JSON.stringify(full.data).includes('password_hash'));pass('Admin membaca data acuan tanpa hash kata sandi');
 for(const [key,n] of [['kl',3],['pemda',2],['darat',1],['laut',1],['udara',1],['plbn',1]]){
   const cookie=await login(key);const state=await call('/api/bootstrap',{cookie});assert.equal(state.status,200);assert.equal(state.data.actor.role,'user');assert.equal(state.data.organizations.length,1);assert.equal(state.data.organizations[0].id,key);assert.equal(state.data.users.length,1);assert.equal(state.data.locations.length,n);assert.ok(state.data.locations.every(l=>l.org_ids.every(id=>id===key)));
   assert.equal((await call('/api/organizations/bnpp',{cookie})).status,404);assert.equal((await call('/api/organizations',{method:'POST',cookie,body:{}})).status,403);
   if(key==='darat')assert.equal((await call('/api/locations/bahari',{cookie})).status,404);
   assert.equal((await call('/api/logout',{method:'POST',cookie})).status,200);assert.equal((await call('/api/bootstrap',{cookie})).status,401);pass(`Akun ${key}: login, lingkup data, penolakan edit dan logout`);
 }
 assert.equal((await call('/api/organizations',{method:'POST',cookie:admin,body:{code:'X'}})).status,400);pass('Validasi server menolak data tidak lengkap');
 const org={code:`TEST-${suffix}`,name:'Organisasi uji sementara',kind:'KL',region:'Wilayah simulasi',active:1};
 const created=await call('/api/organizations',{method:'POST',cookie:admin,body:org});assert.equal(created.status,201,JSON.stringify(created.data));const orgId=created.data.id;cleanup.organizations.push(orgId);
 assert.equal((await call('/api/organizations',{method:'POST',cookie:admin,body:org})).status,409);pass('Pembuatan organisasi dan penolakan kode duplikat');
 org.name='Organisasi uji diperbarui';assert.equal((await call(`/api/organizations/${orgId}`,{method:'PUT',cookie:admin,body:org})).status,200);assert.equal((await call(`/api/organizations/${orgId}`,{cookie:admin})).data.name,org.name);pass('Perubahan organisasi tersimpan dan dibaca ulang');
 const loc={code:`TEST-${suffix}`,name:'Lokus uji sementara',region:'Kawasan simulasi',domain_id:'bwn',description:'Lokus khusus pengujian otomatis.',active:1,org_ids:[orgId]};
 const location=await call('/api/locations',{method:'POST',cookie:admin,body:loc});assert.equal(location.status,201,JSON.stringify(location.data));cleanup.locations.push(location.data.id);
 loc.org_ids=['darat'];assert.equal((await call(`/api/locations/${location.data.id}`,{method:'PUT',cookie:admin,body:loc})).status,200);assert.deepEqual((await call(`/api/locations/${location.data.id}`,{cookie:admin})).data.org_ids,['darat']);pass('Lokus dan perubahan penugasan tersimpan');
 const indicator={code:`TEST-${suffix}`,name:'Indikator uji sementara',unit:'Dokumen',domain_id:'bwn',definition:'Jumlah dokumen simulasi yang diperiksa.',frequency:'Bulanan',active:1};
 const ind=await call('/api/indicators',{method:'POST',cookie:admin,body:indicator});assert.equal(ind.status,201,JSON.stringify(ind.data));cleanup.indicators.push(ind.data.id);indicator.active=0;assert.equal((await call(`/api/indicators/${ind.data.id}`,{method:'PUT',cookie:admin,body:indicator})).status,200);assert.equal((await call(`/api/indicators/${ind.data.id}`,{cookie:admin})).data.active,0);pass('Indikator dapat dibuat dan dinonaktifkan');
 const newUser={name:'Pengguna uji sementara',email:`uji-${suffix}@demo.bnpp.test`,password:'KataSandiUji2027!',role:'user',org_id:orgId,active:1};
 const user=await call('/api/users',{method:'POST',cookie:admin,body:newUser});assert.equal(user.status,201,JSON.stringify(user.data));cleanup.users.push(user.data.id);
 const userAuth=await call('/api/login',{method:'POST',body:{email:newUser.email,password:newUser.password}});assert.equal(userAuth.status,200);const userCookie=userAuth.cookie.split(';')[0];newUser.active=0;delete newUser.password;
 assert.equal((await call(`/api/users/${user.data.id}`,{method:'PUT',cookie:admin,body:newUser})).status,200);assert.equal((await call('/api/bootstrap',{cookie:userCookie})).status,401);pass('Akun baru dapat masuk dan sesi dicabut saat akun dinonaktifkan');
 const self={name:'Admin BNPP',email:'admin@demo.bnpp.test',role:'user',org_id:'bnpp',active:1};assert.equal((await call('/api/users/user-admin',{method:'PUT',cookie:admin,body:self})).status,400);pass('Admin tidak dapat mengurangi akses akun sendiri');
 const log=await call('/api/bootstrap',{cookie:admin});assert.ok(log.data.audits.some(a=>a.entity_id===orgId));pass('Perubahan data tercatat dalam audit');
 for(const path of ['/beranda','/organisasi','/akun','/lokus','/domain','/indikator','/profil','/aktivitas']){const page=await call(path,{cookie:admin});assert.equal(page.status,200,`${path}: ${page.status}`);assert.ok(!String(page.data).includes('Ruang kerja belum tersedia'),path);}
 pass('Seluruh halaman fase 1 berhasil dirender server');
 const logout=await call('/api/logout',{method:'POST',cookie:admin});assert.equal(logout.status,200);assert.equal((await call('/api/bootstrap',{cookie:admin})).status,401);pass('Logout admin mencabut sesi');
 mkdirSync('.sites-runtime',{recursive:true});writeFileSync('.sites-runtime/hasil-uji-fase1.json',JSON.stringify({passed:checks.length,checks,timestamp:new Date().toISOString(),browserVisual:'belum diverifikasi'},null,2));
 console.log(`Selesai: ${checks.length} kelompok pemeriksaan lulus.`);
}finally{
 const q=s=>`'${s.replaceAll("'","''")}'`;const sql=[];
 const all=Object.values(cleanup).flat();if(all.length)sql.push(`DELETE FROM audits WHERE entity_id IN (${all.map(q).join(',')});`);
 for(const id of cleanup.users){sql.push(`DELETE FROM audits WHERE actor_id=${q(id)};`,`DELETE FROM sessions WHERE user_id=${q(id)};`,`DELETE FROM users WHERE id=${q(id)};`);}
 for(const id of cleanup.locations)sql.push(`DELETE FROM assignments WHERE location_id=${q(id)};`,`DELETE FROM locations WHERE id=${q(id)};`);
 for(const id of cleanup.indicators)sql.push(`DELETE FROM indicators WHERE id=${q(id)};`);
 for(const id of cleanup.organizations)sql.push(`DELETE FROM organizations WHERE id=${q(id)};`);
 mkdirSync('.sites-runtime',{recursive:true});writeFileSync('.sites-runtime/cleanup-test.sql',sql.length?sql.join('\n'):'SELECT 1;');
}
