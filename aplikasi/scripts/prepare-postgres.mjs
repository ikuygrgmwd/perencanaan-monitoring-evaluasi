import {neon} from '@neondatabase/serverless';
import {readFileSync, readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL diperlukan. Gunakan node --env-file=.env.local scripts/prepare-postgres.mjs.');
const sql = neon(process.env.DATABASE_URL);
await sql.query('CREATE TABLE IF NOT EXISTS _app_migrations (name text PRIMARY KEY, applied_at bigint NOT NULL)');
const applied = new Set((await sql.query('SELECT name FROM _app_migrations')).map(row => row.name));
for (const name of readdirSync('db/postgres').filter(name => name.endsWith('.sql')).sort()) {
  if (applied.has(name)) continue;
  const statements = readFileSync(`db/postgres/${name}`, 'utf8').split(';').map(s => s.trim()).filter(Boolean);
  await sql.transaction([
    ...statements.map(statement => sql.query(statement)),
    sql.query('INSERT INTO _app_migrations(name,applied_at) VALUES($1,$2)', [name, Date.now()]),
  ]);
  console.log(`Migrasi diterapkan: ${name}`);
}
const seeded = spawnSync(process.execPath, ['scripts/seed-demo.mjs'], {stdio: 'inherit', windowsHide: true});
if (seeded.status !== 0) throw new Error('Seed gagal disiapkan.');
const seed = readFileSync('.sites-runtime/seed-demo.sql', 'utf8').split('\n').filter(Boolean).map(statement =>
  statement.replace('INSERT OR IGNORE INTO', 'INSERT INTO').replace(/;$/, ' ON CONFLICT DO NOTHING')
);
await sql.transaction(seed.map(statement => sql.query(statement)));
console.log('Database PostgreSQL siap. Record yang sudah ada tidak ditimpa.');
