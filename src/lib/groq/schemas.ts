import { AnalysisResult } from '../../types';

export function validateAnalysisResult(data: any): AnalysisResult | null {
  if (!data || typeof data !== 'object') return null;

  try {
    return {
      summary: typeof data.summary === 'string' ? data.summary : 'Project Analysis',
      tasks: Array.isArray(data.tasks) ? data.tasks : [],
      deadlines: Array.isArray(data.deadlines) ? data.deadlines : [],
      decisions: Array.isArray(data.decisions) ? data.decisions : [],
      entities: Array.isArray(data.entities) ? data.entities : [],
      dependencies: Array.isArray(data.dependencies) ? data.dependencies : [],
      risks: Array.isArray(data.risks) ? data.risks : [],
      clarifications: Array.isArray(data.clarifications) ? data.clarifications.map((c: any, idx: number) => ({
        id: c.id || `clarification-${idx + 1}`,
        question: c.question || 'What is the owner for this task?',
        reason: c.reason || 'Impacts execution chain',
        impact: c.impact || 'HIGH',
        priority: c.priority || idx + 1,
        status: 'OPEN'
      })) : [],
      actionPlan: Array.isArray(data.actionPlan) ? data.actionPlan : [],
      readinessScore: typeof data.readinessScore === 'number' ? data.readinessScore : 62,
      readinessStatus: data.readinessStatus || 'READY WITH WARNINGS',
      readinessBreakdown: data.readinessBreakdown || {
        baseScore: 100,
        penalties: [],
        finalScore: 62,
        status: 'READY WITH WARNINGS'
      },
      confidence: typeof data.confidence === 'number' ? data.confidence : 0.85,
      confidenceReason: typeof data.confidenceReason === 'string' ? data.confidenceReason : 'Extracted from source text'
    };
  } catch (err) {
    console.error('[validateAnalysisResult] Schema validation failed:', err);
    return null;
  }
}
