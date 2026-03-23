import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'monitors.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS monitores (
   id TEXT PRIMARY KEY NOT NULL,
   url TEXT NOT NULL,
   apelido TEXT NOT NULL,
   ultimoStatus TEXT
  )
`);

export default db;
