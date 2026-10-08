import {readFileSync} from 'node:fs';
import {neon} from '@neondatabase/serverless';
import {DatabaseSync} from 'node:sqlite';

// This file is produced by check-phase1.mjs and contains only its own temporary record IDs.
const statements = readFileSync('.sites-runtime/cleanup-test.sql', 'utf8').split(';').map(s => s.trim()).filter(Boolean);
if (process.env.DATABASE_URL) {
  const sql = neon(process.env.DATABASE_URL);
  await sql.transaction(statements.map(statement => sql.query(statement)));
} else {
  const db = new DatabaseSync(process.env.SQLITE_PATH || '.data/demo.sqlite');
  db.exec('PRAGMA foreign_keys=ON; BEGIN IMMEDIATE;');
  try {for (const statement of statements) db.exec(statement);db.exec('COMMIT');}
  catch (error) {db.exec('ROLLBACK');throw error;}
  finally {db.close();}
}
console.log('Record sementara pengujian dibersihkan.');
