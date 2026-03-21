import path from 'path';
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));


import express from 'express';
import cors from 'cors';
import { trainersRouter } from './routes/trainers.js';
import { reservationsRouter } from './routes/reservations.js';
import { healthRouter } from './routes/health.js';
import { uploadRouter } from './routes/upload.js';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "API running" });
  }); 
app.use('/health', healthRouter);
app.use('/api/trainers', trainersRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api', uploadRouter);

export default app;
