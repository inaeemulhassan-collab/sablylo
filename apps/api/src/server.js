import { readConfig } from './config.js';
import { makePool } from './db/pool.js';
import { createApp } from './app.js';

const config = readConfig();
const pool = makePool(config);
const app = createApp({ pool, frontendUrl: config.FRONTEND_URL });
const server = app.listen(config.PORT, '0.0.0.0', () =>
  console.log('Sablylo API listening on port ' + config.PORT)
);
const shutdown = async () => {
  server.close(async () => { await pool.end(); process.exit(0); });
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
