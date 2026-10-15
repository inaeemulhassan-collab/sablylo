import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import { createCatalogRouter } from './catalog.js';

export function createApp({ pool, frontendUrl }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: frontendUrl, methods: ['GET','OPTIONS'] }));
  app.use(express.json({ limit: '32kb' }));
  app.use('/api', rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-7', legacyHeaders: false }));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'sablylo-api' }));
  app.use('/api/v1', createCatalogRouter(express, pool));
  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
  app.use((err, _req, res, _next) => {
    if (err instanceof ZodError) return res.status(400).json({ error: 'Invalid request', details: err.flatten() });
    console.error('API request failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
  return app;
}
