import {neon} from '@neondatabase/serverless';
import {DatabaseSync, type SQLInputValue} from 'node:sqlite';
import {existsSync} from 'node:fs';
import {join} from 'node:path';

type Row = Record<string, unknown>;
type Result<T> = {results: T[]};
type Execute = (sql: string, values: unknown[], read: boolean) => Promise<Row[]>;

// Application-owned SQL uses question marks only for bound parameters.
function postgresQuery(query: string) {
  let index = 0;
  return query.replace(/\?/g, () => `$${++index}`);
}

export class PreparedStatement {
  constructor(readonly sql: string, readonly values: unknown[], private execute: Execute) {}
  bind(...values: unknown[]) {return new PreparedStatement(this.sql, values, this.execute);}
  async all<T = Row>(): Promise<Result<T>> {return {results: await this.execute(this.sql, this.values, true) as T[]};}
  async first<T = Row>(): Promise<T | null> {return (await this.all<T>()).results[0] ?? null;}
  async run() {await this.execute(this.sql, this.values, false);return {success: true};}
}

interface AppDatabase {
  prepare(sql: string): PreparedStatement;
  batch(statements: PreparedStatement[]): Promise<unknown>;
}

let connection: AppDatabase | undefined;
export function database(): AppDatabase {
  if (connection) return connection;
  const url = process.env.DATABASE_URL;
  if (url) {
    const client = neon(url);
    const execute: Execute = async (sql, values) => {
      const rows = await client.query(postgresQuery(sql), values);
      return rows.map(row => Object.fromEntries(Object.entries(row).map(([key, value]) =>
        [key, ['created_at', 'expires_at', 'until'].includes(key) && typeof value === 'string' ? Number(value) : value]
      )));
    };
    connection = {
      prepare: sql => new PreparedStatement(sql, [], execute),
      // Changes and audit records commit together or are rolled back together.
      batch: statements => client.transaction(statements.map(statement =>
        client.query(postgresQuery(statement.sql), statement.values)
      )),
    };
  } else {
    if (process.env.VERCEL) {
      // Preview tanpa DATABASE_URL: kembalikan antarmuka stub agar halaman statis tetap dapat diakses.
      // Setiap panggilan API akan menghasilkan AppError(503) yang ditangkap oleh handler.
      const notAvailable: Execute = async () => { throw new Error('Database belum dikonfigurasi. Tambahkan DATABASE_URL di environment Vercel.'); };
      connection = {
        prepare: sql => new PreparedStatement(sql, [], notAvailable),
        batch: async () => { throw new Error('Database belum dikonfigurasi.'); },
      };
      return connection;
    }
    const file = join(process.cwd(), '.data', 'demo.sqlite');
    if (!existsSync(file)) throw new Error('Database lokal belum disiapkan. Jalankan npm run db:local.');
    const sqlite = new DatabaseSync(file);
    sqlite.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;');
    const execute: Execute = async (sql, values, read) => {
      const statement = sqlite.prepare(sql);
      if (read) return statement.all(...values as SQLInputValue[]) as Row[];
      statement.run(...values as SQLInputValue[]);
      return [];
    };
    connection = {
      prepare: sql => new PreparedStatement(sql, [], execute),
      async batch(statements) {
        sqlite.exec('BEGIN IMMEDIATE');
        try {
          // Synchronous transaction avoids interleaving another request on this connection.
          for (const statement of statements) sqlite.prepare(statement.sql).run(...statement.values as SQLInputValue[]);
          sqlite.exec('COMMIT');
        } catch (error) {sqlite.exec('ROLLBACK');throw error;}
      },
    };
  }
  return connection;
}
