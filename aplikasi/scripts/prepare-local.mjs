import {spawnSync} from 'node:child_process';
import {readdirSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('../',import.meta.url)));
function run(args,capture=false){
  const result=spawnSync(process.execPath,args,{encoding:'utf8',stdio:capture?'pipe':'inherit',windowsHide:true});
  if(result.status!==0){if(capture)console.error(result.stdout,result.stderr);throw new Error('Persiapan gagal. Periksa keluaran di atas.');}
  return result.stdout||'';
}
if(!existsSync('node_modules/vinext'))throw new Error('Pasang dependensi terlebih dahulu dengan npm run install:ci.');
run(['--import','./scripts/sites-env.mjs','scripts/run-framework.mjs','build']);
const cli=['--import','./scripts/sites-env.mjs','node_modules/wrangler/bin/wrangler.js','d1','execute','DB','--local','--config','dist/server/wrangler.json','--persist-to','.wrangler/state'];
const result=JSON.parse(run([...cli,'--command',"SELECT name FROM sqlite_master WHERE type='table' AND name IN ('assignments','audits','domains','indicators','locations','login_limits','organizations','sessions','users')",'--json'],true));
const tables=result.flatMap(r=>r.results||[]).map(r=>r.name);
const migrations=readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort();
if(tables.length===0){for(const migration of migrations)run([...cli,'--file',`drizzle/${migration}`,'--json'],true);}
else if(tables.length!==9||migrations.length!==1){throw new Error('Database sudah ada atau skema berubah. Tinjau dan jalankan hanya migrasi baru; persiapan tidak akan menimpa data.');}
run(['scripts/seed-demo.mjs']);
run([...cli,'--file','.sites-runtime/seed-demo.sql','--json'],true);
console.log('Database demo siap. Data yang sudah ada tidak ditimpa. Jalankan npm run dev.');
