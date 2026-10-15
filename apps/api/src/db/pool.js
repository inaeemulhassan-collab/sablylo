import mysql from 'mysql2/promise';

export function makePool(config) {
  return mysql.createPool({
    host: config.DB_HOST, port: config.DB_PORT, database: config.DB_NAME,
    user: config.DB_USER, password: config.DB_PASSWORD,
    waitForConnections: true, connectionLimit: 5, queueLimit: 25,
    decimalNumbers: false, namedPlaceholders: false,
    timezone: 'Z'
  });
}
