import { ExecutionGraph, GraphNode } from './graph';
import { calculateReadinessScore } from './readiness';
import { TaskItem, DependencyItem, RiskItem, ReadinessScoreBreakdown } from '../../types';

export interface AuditResult {
  readiness: ReadinessScoreBreakdown;
  cycles: string[][];
  unassignedTasks: TaskItem[];
  blockedTasks: TaskItem[];
  resourceConflicts: { person: string; taskCount: number; tasks: string[] }[];
  criticalPath: string[];
}

export function runDeterministicAudit(
  tasks: TaskItem[],
  dependencies: DependencyItem[],
  risks: RiskItem[]
): AuditResult {
  const graph = new ExecutionGraph();

  // Populate graph nodes
  tasks.forEach(t => {
    graph.addNode({
      id: t.id,
      type: 'TASK',
      name: t.title,
      data: t
    });
  });

  // Populate graph edges
  dependencies.forEach((d, idx) => {
    graph.addEdge({
      id: d.id || `edge-${idx}`,
      sourceNodeId: d.fromTaskId,
      targetNodeId: d.toTaskId,
      type: 'DEPENDS_ON',
      certainty: d.confidenceType || 'EXPLICIT'
    });
  });

  const cycles = graph.detectCycles();
  const unassignedTasks = graph.findUnassignedTasks(tasks);
  const blockedTasks = graph.findBlockedTasks(tasks);
  const conflictsMap = graph.findResourceConflicts(tasks);

  const resourceConflicts = Array.from(conflictsMap.entries()).map(([person, taskList]) => ({
    person,
    taskCount: taskList.length,
    tasks: taskList.map(t => t.title)
  }));

  const criticalPath = graph.findCriticalPath();
  const readiness = calculateReadinessScore(tasks, dependencies, risks, cycles);

  return {
    readiness,
    cycles,
    unassignedTasks,
    blockedTasks,
    resourceConflicts,
    criticalPath
  };
}
