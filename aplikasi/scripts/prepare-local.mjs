import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,readFileSync,readdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
const file=process.env.SQLITE_PATH||'.data/demo.sqlite';
mkdirSync(dirname(file),{recursive:true});
const db=new DatabaseSync(file);
db.exec('PRAGMA foreign_keys=ON;');
db.exec('CREATE TABLE IF NOT EXISTS _app_migrations(name TEXT PRIMARY KEY)');
const applied=new Set(db.prepare('SELECT name FROM _app_migrations').all().map(row=>row.name));
for(const name of readdirSync('drizzle').filter(name=>name.endsWith('.sql')).sort()){
 if(applied.has(name))continue;
 db.exec('BEGIN IMMEDIATE;');
 try{db.exec(readFileSync('drizzle/'+name,'utf8'));db.prepare('INSERT INTO _app_migrations(name) VALUES(?)').run(name);db.exec('COMMIT');}
 catch(error){db.exec('ROLLBACK');throw error;}
}
const seed=spawnSync(process.execPath,['scripts/seed-demo.mjs'],{stdio:'inherit',windowsHide:true});
if(seed.status!==0)throw new Error('Seed gagal disiapkan.');
db.exec('BEGIN IMMEDIATE');
try{db.exec(readFileSync('.sites-runtime/seed-demo.sql','utf8'));db.exec('COMMIT');}
catch(error){db.exec('ROLLBACK');throw error;}
db.close();console.log('Database SQLite lokal siap; data lama tidak ditimpa.');
