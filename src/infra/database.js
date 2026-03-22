import Database from 'better-sqlite3';

const db = new Database('./data/monitors.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS monitores (
   id TEXT PRIMARY KEY NOT NULL,
   url TEXT NOT NULL,
   apelido TEXT NOT NULL,
   ultimoStatus TEXT
  )
`);

export default db;
