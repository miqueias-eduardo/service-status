import pg from 'pg';

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Cria a tabela se não existir
await db.query(`
  CREATE TABLE IF NOT EXISTS monitores (
    id TEXT PRIMARY KEY NOT NULL,
    url TEXT NOT NULL,
    apelido TEXT NOT NULL,
    ultimo_status TEXT
  )
`);

export default db;
