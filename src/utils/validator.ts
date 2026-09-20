import {
  AnalysisResult,
  TaskItem,
  DeadlineItem,
  DecisionItem,
  EntityItem,
  DependencyItem,
  RiskItem,
  ClarificationItem,
  ActionStep,
  ScenarioResult
} from '../types';
import { auditExecutionGraph } from './auditEngine';

export function validateAndSanitizeAnalysis(input: any): AnalysisResult {
  if (!input || typeof input !== 'object') {
    throw new Error("Invalid response format: Expected JSON object.");
  }

  const summary = typeof input.summary === 'string' && input.summary.trim()
    ? input.summary.trim()
    : "Analysis completed. Summary unavailable.";

  const tasks: TaskItem[] = Array.isArray(input.tasks)
    ? input.tasks.map((t: any, idx: number) => ({
        id: typeof t.id === 'string' && t.id ? t.id : `task-${idx + 1}`,
        title: typeof t.title === 'string' && t.title ? t.title.trim() : `Task ${idx + 1}`,
        description: typeof t.description === 'string' ? t.description.trim() : '',
        assignee: typeof t.assignee === 'string' && t.assignee ? t.assignee.trim() : 'Unassigned',
        priority: ['High', 'Medium', 'Low', 'Unspecified'].includes(t.priority) ? t.priority : 'Unspecified',
        deadline: typeof t.deadline === 'string' && t.deadline ? t.deadline.trim() : 'Unspecified',
        status: ['Pending', 'In Progress', 'Completed', 'Unspecified'].includes(t.status) ? t.status : 'Pending',
        source: typeof t.source === 'string' ? t.source.trim() : 'Extracted from content',
        durationHours: typeof t.durationHours === 'number' ? t.durationHours : 1.0
      }))
    : [];

  const deadlines: DeadlineItem[] = Array.isArray(input.deadlines)
    ? input.deadlines.map((d: any) => ({
        event: typeof d.event === 'string' ? d.event.trim() : 'Deadline',
        date: typeof d.date === 'string' ? d.date.trim() : 'Unspecified date',
        time: typeof d.time === 'string' ? d.time.trim() : 'Unspecified time',
        source: typeof d.source === 'string' ? d.source.trim() : 'Extracted from content'
      }))
    : [];

  const decisions: DecisionItem[] = Array.isArray(input.decisions)
    ? input.decisions.map((dec: any) => ({
        decision: typeof dec.decision === 'string' ? dec.decision.trim() : String(dec),
        source: typeof dec.source === 'string' ? dec.source.trim() : 'Extracted from content'
      }))
    : [];

  const entities: EntityItem[] = Array.isArray(input.entities)
    ? input.entities.map((e: any) => ({
        name: typeof e.name === 'string' ? e.name.trim() : (typeof e === 'string' ? e : 'Entity'),
        type: ['Person', 'Team', 'Tool', 'Date', 'Other'].includes(e.type) ? e.type : 'Other'
      }))
    : [];

  const dependencies: DependencyItem[] = Array.isArray(input.dependencies)
    ? input.dependencies.map((dep: any, idx: number) => ({
        id: typeof dep.id === 'string' ? dep.id : `dep-${idx + 1}`,
        fromTaskId: typeof dep.fromTaskId === 'string' ? dep.fromTaskId : (tasks[idx]?.id || 'task-1'),
        toTaskId: typeof dep.toTaskId === 'string' ? dep.toTaskId : (tasks[idx + 1]?.id || 'task-2'),
        relationshipType: ['depends_on', 'assigned_to', 'blocks', 'requires', 'produces', 'precedes', 'conflicts_with'].includes(dep.relationshipType)
          ? dep.relationshipType
          : 'depends_on',
        confidenceType: ['EXPLICIT', 'INFERRED', 'UNKNOWN'].includes(dep.confidenceType) ? dep.confidenceType : 'EXPLICIT',
        source: typeof dep.source === 'string' ? dep.source.trim() : 'Document context'
      }))
    : [];

  const rawRisks: RiskItem[] = Array.isArray(input.risks)
    ? input.risks.map((r: any, idx: number) => ({
        id: typeof r.id === 'string' ? r.id : `risk-${idx + 1}`,
        riskType: typeof r.riskType === 'string' ? r.riskType : 'Execution Risk',
        severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(r.severity) ? r.severity : 'HIGH',
        title: typeof r.title === 'string' ? r.title : `Risk Item ${idx + 1}`,
        description: typeof r.description === 'string' ? r.description : '',
        evidence: typeof r.evidence === 'string' ? r.evidence : 'Extracted from content',
        classification: ['EXPLICIT', 'INFERRED', 'UNKNOWN'].includes(r.classification) ? r.classification : 'INFERRED',
        resolved: Boolean(r.resolved)
      }))
    : [];

  const clarifications: ClarificationItem[] = Array.isArray(input.clarifications)
    ? input.clarifications.map((c: any, idx: number) => ({
        id: typeof c.id === 'string' ? c.id : `clarify-${idx + 1}`,
        question: typeof c.question === 'string' ? c.question.trim() : `Clarification Question ${idx + 1}`,
        reason: typeof c.reason === 'string' ? c.reason.trim() : 'Impacts readiness calculation',
        impact: ['HIGH', 'MEDIUM', 'LOW'].includes(c.impact) ? c.impact : 'HIGH',
        priority: typeof c.priority === 'number' ? c.priority : idx + 1,
        status: ['OPEN', 'ANSWERED'].includes(c.status) ? c.status : 'OPEN',
        answer: typeof c.answer === 'string' ? c.answer : undefined
      }))
    : [];

  const actionPlan: ActionStep[] = Array.isArray(input.actionPlan)
    ? input.actionPlan.map((step: any, idx: number) => ({
        step: typeof step.step === 'number' ? step.step : idx + 1,
        taskId: typeof step.taskId === 'string' ? step.taskId : undefined,
        action: typeof step.action === 'string' ? step.action.trim() : 'Action step',
        reason: typeof step.reason === 'string' ? step.reason.trim() : 'Recommended execution step',
        dependency: typeof step.dependency === 'string' ? step.dependency.trim() : 'None',
        risk: typeof step.risk === 'string' ? step.risk : undefined,
        isApproved: Boolean(step.isApproved)
      }))
    : [];

  const scenarios: ScenarioResult[] = Array.isArray(input.scenarios)
    ? input.scenarios
    : [];

  // Run Deterministic Graph Audit & Calculate Execution Readiness
  const audit = auditExecutionGraph(tasks, dependencies, rawRisks);

  let confidence = typeof input.confidence === 'number' ? Math.round(input.confidence) : 85;
  if (confidence < 0) confidence = 0;
  if (confidence > 100) confidence = 100;

  const confidenceReason = typeof input.confidenceReason === 'string' && input.confidenceReason.trim()
    ? input.confidenceReason.trim()
    : `Confidence score (${confidence}%) calculated based on task ownership clarity, deadline precision, and dependency evidence.`;

  return {
    summary,
    tasks,
    deadlines,
    decisions,
    entities,
    dependencies,
    risks: audit.risks,
    clarifications,
    actionPlan,
    readinessScore: audit.readinessScore,
    readinessStatus: audit.readinessStatus,
    readinessBreakdown: audit.breakdown,
    scenarios,
    confidence,
    confidenceReason,
    timestamp: new Date().toISOString()
  };
}
