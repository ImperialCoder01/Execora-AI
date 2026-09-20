import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import healthRoutes from './routes/health.routes';
import diagnosticsRoutes from './routes/diagnostics.routes';
import docParserRoutes from './routes/docParser.routes';
import projectsRoutes from './routes/projects.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration supporting Render environment and UptimeRobot keep-alive
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Groq-Api-Key', 'X-Tenant-Id', 'X-User-Id']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Register Modular API Routes
app.use('/api', healthRoutes);
app.use('/api', diagnosticsRoutes);
app.use('/api', docParserRoutes);
app.use('/api', projectsRoutes);

// Static frontend file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

app.use(express.static(distPath));

app.get('*', (req: Request, res: Response) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Execora Production Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`⚡ Keep-Alive Endpoint for UptimeRobot: http://localhost:${PORT}/api/keep-alive`);
});
