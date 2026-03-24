import path from 'path';
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));


import express from 'express';
import cors from 'cors';
import { trainersRouter } from './routes/trainers.js';
import { reservationsRouter } from './routes/reservations.js';
import { healthRouter } from './routes/health.js';
import { uploadRouter } from './routes/upload.js';
import { v2Router } from './routes/v2/index.js';
import { debugDbRouter } from './routes/debugDb.js';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "API running" });
  });
app.use('/health', healthRouter);

// v1 API (하위 호환성 유지)
app.use('/api/trainers', trainersRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api', uploadRouter);

// v2 API
app.use('/api/v2', v2Router);

// 로컬/개발용 DynamoDB 뷰어 (ENABLE_DB_DEBUG=false 로 끌 수 있음)
app.use('/api/debug/db', debugDbRouter);

export default app;
