import { Router, Request, Response } from 'express';

const router = Router();

// Standard Health Check
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Execora AI API Backend',
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    cogneeConfigured: Boolean(process.env.COGNEE_API_KEY),
    supabaseConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

// UptimeRobot Dedicated Keep-Alive Endpoint
router.get('/keep-alive', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    message: 'Execora Backend instance active and responding to UptimeRobot ping',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

export default router;
