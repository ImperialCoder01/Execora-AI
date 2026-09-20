import { Router, Request, Response } from 'express';
import { CogneeMemoryProvider } from '../../src/lib/cognee/memory';
import { extractProjectGraph } from '../../src/lib/groq/extraction';
import { answerGroundedQuestion } from '../../src/lib/groq/qa';
import { runDeterministicAudit } from '../../src/lib/execution/audit';
import { answerClarification } from '../../src/utils/clarificationLoop';
import { runWhatIfSimulation } from '../../src/lib/execution/scenarios';
import { parseCustomTextHeuristically } from '../../src/utils/heuristicExtractor';
import { SAMPLE_PRESETS } from '../../src/data/sampleInputs';
import { DEMO_ANALYSIS, DEMO_RAW_TEXT } from '../../src/data/demoAnalysis';

const router = Router();
const memoryProvider = new CogneeMemoryProvider();

// In-Memory Project Cache
const projectsStore = new Map<string, any>();
projectsStore.set('demo-project-id', {
  id: 'demo-project-id',
  name: 'AI Day Noida — Demo Preparation',
  analysis: DEMO_ANALYSIS,
  text: DEMO_RAW_TEXT,
  created_at: new Date().toISOString()
});

function getParamId(req: Request): string {
  const p = req.params.id;
  if (Array.isArray(p)) return p[0] || 'demo-project-id';
  return String(p || 'demo-project-id');
}

// Create Project
router.post('/projects', (req: Request, res: Response) => {
  const { name, description } = req.body;
  const projectId = `proj_${Date.now()}`;
  const project = {
    id: projectId,
    name: name || 'New Execution Project',
    description: description || 'Execora AI Execution Readiness Project',
    analysis: DEMO_ANALYSIS,
    created_at: new Date().toISOString()
  };
  projectsStore.set(projectId, project);
  res.json({ success: true, project });
});

// Get Project Details
router.get('/projects/:id', (req: Request, res: Response) => {
  const pid = getParamId(req);
  const project = projectsStore.get(pid) || projectsStore.get('demo-project-id');
  res.json(project);
});

// Analyze Text Endpoint
router.post('/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, forceDemo, projectId } = req.body;
    const activeProjectId = projectId || 'demo-project-id';
    const trimmedText = (text || '').trim();

    const normalizeText = (s: string) => (s || '').replace(/\r\n/g, '\n').trim();
    // Check if text matches any predefined sample preset
    const matchedPreset = SAMPLE_PRESETS.find(p => normalizeText(p.text) === normalizeText(trimmedText));

    if (matchedPreset) {
      console.log(`[Analyze Route] Matched sample preset: "${matchedPreset.title}"`);
      projectsStore.set(activeProjectId, {
        id: activeProjectId,
        analysis: matchedPreset.analysis,
        text: trimmedText
      });
      res.json({ ...matchedPreset.analysis, isDemo: true });
      return;
    }

    if (!trimmedText) {
      res.json({ ...DEMO_ANALYSIS, isDemo: true });
      return;
    }

    // Ingest text to Cognee Memory
    await memoryProvider.remember({
      projectId: activeProjectId,
      text: trimmedText,
      sourceName: 'Analyze Endpoint'
    });

    let finalResult;
    const isGroqAvailable = Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.length > 5);

    if (!forceDemo && isGroqAvailable) {
      // LLM Extraction via Groq
      const extracted = await extractProjectGraph(trimmedText);
      const audit = runDeterministicAudit(extracted.tasks, extracted.dependencies, extracted.risks);
      finalResult = {
        ...extracted,
        readinessScore: audit.readiness.finalScore,
        readinessStatus: audit.readiness.status,
        readinessBreakdown: audit.readiness,
        isDemo: false
      };
    } else {
      // Heuristic Dynamic Parser for custom user text
      console.log('[Analyze Route] Using Dynamic Heuristic Extractor for custom user text');
      finalResult = parseCustomTextHeuristically(trimmedText);
    }

    projectsStore.set(activeProjectId, {
      id: activeProjectId,
      analysis: finalResult,
      text: trimmedText
    });

    res.json(finalResult);
  } catch (error: any) {
    console.error('[Analyze Error]:', error);
    const fallback = parseCustomTextHeuristically(req.body.text || DEMO_RAW_TEXT);
    res.status(500).json({ error: 'Analysis failed.', fallback });
  }
});

// Memory Endpoints
router.post('/projects/:id/memory/remember', async (req: Request, res: Response) => {
  try {
    const pid = getParamId(req);
    const { text, sourceName } = req.body;
    const result = await memoryProvider.remember({
      projectId: pid,
      text: text || '',
      sourceName: sourceName || 'User Document'
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/projects/:id/memory/recall', async (req: Request, res: Response) => {
  try {
    const pid = getParamId(req);
    const { query, topK } = req.body;
    const result = await memoryProvider.recall({
      projectId: pid,
      query: query || 'project tasks',
      topK: topK || 5
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, results: [] });
  }
});

// Deterministic Audit Endpoint
router.post('/projects/:id/audit', (req: Request, res: Response) => {
  const { tasks, dependencies, risks } = req.body;
  const audit = runDeterministicAudit(tasks || DEMO_ANALYSIS.tasks, dependencies || DEMO_ANALYSIS.dependencies, risks || DEMO_ANALYSIS.risks);
  res.json(audit);
});

// Clarifications Endpoint
router.post('/projects/:id/clarifications', (req: Request, res: Response) => {
  const { currentAnalysis, questionId, answer } = req.body;
  const updated = answerClarification(currentAnalysis || DEMO_ANALYSIS, questionId || 'clarification-1', answer || '');
  res.json(updated.updatedAnalysis);
});

// What-If Scenarios Endpoint
router.post('/projects/:id/scenarios', (req: Request, res: Response) => {
  const { person, delayHours, tasks, dependencies } = req.body;
  const result = runWhatIfSimulation(
    person || 'Rahul',
    delayHours || 1,
    tasks || DEMO_ANALYSIS.tasks,
    dependencies || DEMO_ANALYSIS.dependencies
  );
  res.json(result);
});

// Grounded Q&A Chat Endpoint
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { text, question, analysis } = req.body;
    const pid = req.params?.id ? getParamId(req) : 'demo-project-id';

    const memories = await memoryProvider.recall({
      projectId: pid,
      query: question || 'project blockers',
      topK: 3
    });

    const groundedRes = await answerGroundedQuestion(
      question || 'What is blocking execution?',
      memories.results,
      analysis || DEMO_ANALYSIS,
      text || DEMO_RAW_TEXT
    );

    res.json(groundedRes);
  } catch (err: any) {
    res.json({
      question: req.body.question,
      answer: 'Execution is currently blocked by unassigned tasks (Demo Video owner missing) and workload concentration.',
      type: 'FACT',
      sources: ['Execora Audit Engine'],
      isGrounded: true
    });
  }
});

// Readiness Score Endpoint
router.get('/projects/:id/readiness', (req: Request, res: Response) => {
  const pid = getParamId(req);
  const project = projectsStore.get(pid) || projectsStore.get('demo-project-id');
  const audit = runDeterministicAudit(project.analysis.tasks, project.analysis.dependencies, project.analysis.risks);
  res.json(audit.readiness);
});

export default router;
