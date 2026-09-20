import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import healthRoutes from '../server/routes/health.routes';
import diagnosticsRoutes from '../server/routes/diagnostics.routes';
import docParserRoutes from '../server/routes/docParser.routes';
import projectsRoutes from '../server/routes/projects.routes';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Groq-Api-Key', 'X-Tenant-Id', 'X-User-Id']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Register Modular API Routes for Vercel Serverless
app.use('/api', healthRoutes);
app.use('/api', diagnosticsRoutes);
app.use('/api', docParserRoutes);
app.use('/api', projectsRoutes);

export default app;
