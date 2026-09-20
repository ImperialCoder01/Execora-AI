import { Router, Request, Response } from 'express';

const router = Router();

router.get('/diagnostics', (req: Request, res: Response) => {
  res.json({
    groq: process.env.GROQ_API_KEY ? 'CONNECTED' : 'FALLBACK_MODE',
    cognee: process.env.COGNEE_API_KEY ? 'CONNECTED' : 'FALLBACK_MODE',
    supabase: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'CONNECTED' : 'LOCAL_STORE',
    demoMode: 'AVAILABLE',
    tenantId: process.env.COGNEE_TENANT_ID || 'b4ea654e-84d5-4ba3-a3c7-333cc3e04fb1',
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    renderDeployment: Boolean(process.env.RENDER || process.env.RENDER_SERVICE_ID)
  });
});

export default router;
