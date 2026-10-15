import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { readConfig } from '../config.js';

const config = readConfig();
const connection = await mysql.createConnection({
  host: config.DB_HOST, port: config.DB_PORT,
  user: config.DB_USER, password: config.DB_PASSWORD,
  database: config.DB_NAME, multipleStatements: true,
});
try {
  await connection.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(120) PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB`);
  const directory = fileURLToPath(new URL('../../migrations/', import.meta.url));
  const files = (await readdir(directory)).filter(f => /^\d+_[a-z0-9_]+\.sql$/.test(f)).sort();
  for (const filename of files) {
    const [rows] = await connection.execute('SELECT version FROM schema_migrations WHERE version = ?', [filename]);
    if (rows.length) { console.log('Already applied:', filename); continue; }
    const sql = await readFile(path.join(directory, filename), 'utf8');
    // DDL auto-commits in MySQL; retryable CREATE IF NOT EXISTS statements make reruns safe.
    await connection.query(sql);
    await connection.execute('INSERT INTO schema_migrations(version) VALUES (?)', [filename]);
    console.log('Applied:', filename);
  }
} finally {
  await connection.end();
}
