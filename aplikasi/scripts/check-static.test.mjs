import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {readDemoData,demoAccounts} from '../lib/demo-data.ts';

test('semua akun demo memiliki identitas dan lingkup data yang sesuai',()=>{
  const expected={admin:6,kl:3,pemda:2,darat:1,laut:1,udara:1,plbn:1};
  for(const {key,org} of demoAccounts){
    const data=readDemoData(key);
    assert.equal(data.actor.email,`${key}@demo.bnpp.test`);
    assert.equal(data.actor.org_id,org);
    assert.equal(data.locations.length,expected[key]);
    assert.equal(data.domains.length,4);
    assert.equal(data.indicators.length,6);
    if(key!=='admin'){
      assert.equal(data.organizations.length,1);
      assert.equal(data.users.length,1);
      assert.ok(data.locations.every(location=>location.org_ids.includes(org)));
    }else{
      assert.equal(data.organizations.length,7);
      assert.equal(data.users.length,7);
    }
    assert.ok(data.audits.every(a=>a.summary.startsWith('Contoh aktivitas:')));
  }
  assert.equal(readDemoData('akun-tidak-dikenal'),null);
});

test('relasi data dummy konsisten tanpa password hash atau token',()=>{
  const data=readDemoData('admin');
  const domainIds=new Set(data.domains.map(item=>item.id));
  const orgIds=new Set(data.organizations.map(item=>item.id));
  for(const item of [...data.locations,...data.indicators])assert.ok(domainIds.has(item.domain_id));
  for(const location of data.locations)assert.ok(location.org_ids.every(id=>orgIds.has(id)));
  assert.doesNotMatch(JSON.stringify(data),/password_hash|session_token/);
});

test('build mengekspor semua halaman sebagai HTML tanpa endpoint API',()=>{
  const output=fileURLToPath(new URL('../out/',import.meta.url));
  for(const route of ['','login/','beranda/','organisasi/','akun/','lokus/','domain/','indikator/','profil/','aktivitas/']){
    assert.ok(existsSync(`${output}${route}index.html`),`HTML ${route||'/'} harus tersedia`);
  }
  assert.ok(existsSync(`${output}404.html`));
  assert.equal(existsSync(`${output}api`),false);
  const appPaths=JSON.parse(readFileSync(new URL('../.next/server/app-paths-manifest.json',import.meta.url),'utf8'));
  assert.ok(Object.keys(appPaths).every(path=>!path.startsWith('/api/')));
});
