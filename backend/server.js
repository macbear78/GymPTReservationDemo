import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `[server] Port ${PORT} is already in use. Close the other terminal (Ctrl+C) or stop the process using that port, or set PORT to another value in .env`
    );
  } else {
    console.error('[server]', err);
  }
  process.exit(1);
});
