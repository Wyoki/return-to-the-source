import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import { router as teamRouter } from './routes/team.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

/* ➊  gzip everything  */
app.use(compression());

/* ➋  static with 1-year cache for images  */
app.use(express.static(path.join(__dirname, '../frontend'), {
  maxAge: '1y',
  setHeaders(res, filePath) {
    if (filePath.match(/\.(jpg|png|svg|webp)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

/* ➌  API head-start  */
app.use('/api', teamRouter);

/* ➍  health probe for CI  */
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

app.listen(PORT, () => console.log(`➤  RTS running on http://localhost:${PORT}`));