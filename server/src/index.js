import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';

import contactRouter from './routes/contact.js';
import contentRouter from './routes/content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST = path.resolve(__dirname, '../../client/dist');

const app = express();
const PORT = Number(process.env.PORT) || 5174;
const isProd = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');
app.use(compression());
app.use(express.json({ limit: '32kb' }));
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()) || true,
  })
);

/* ---------------------------------- API ---------------------------------- */

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'vino-portfolio-api', uptime: process.uptime() });
});

app.use('/api/content', contentRouter);
app.use('/api/contact', contactRouter);

app.use('/api', (_req, res) => res.status(404).json({ ok: false, error: 'Unknown endpoint' }));

/* ------------------------- Static client (built app) ---------------------- */

if (fs.existsSync(CLIENT_DIST)) {
  app.use(
    express.static(CLIENT_DIST, {
      maxAge: isProd ? '1y' : 0,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
      },
    })
  );
  // SPA fallback — every non-API route renders the React app. Requests that
  // look like a file (résumé PDF, images…) 404 properly instead of silently
  // serving the HTML shell.
  app.get('*', (req, res) => {
    if (path.extname(req.path)) return res.status(404).type('text/plain').send('Not found');
    return res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
} else {
  app.get('/', (_req, res) =>
    res
      .status(200)
      .type('text/plain')
      .send('API is running. Build the client with `npm run build`, or use `npm run dev`.')
  );
}

/* ------------------------------ Error handler ----------------------------- */

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[server]', err);
  res.status(500).json({ ok: false, error: 'Something broke on our side.' });
});

// Bind to 0.0.0.0 so cloud hosts (Render, Railway, Fly…) can route to it.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✿ vino.made API listening on port ${PORT}`);
  if (!fs.existsSync(CLIENT_DIST)) console.log('  (no client build yet — run `npm run build`)');
});
