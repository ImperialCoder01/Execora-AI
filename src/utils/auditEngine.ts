import { TaskItem, DependencyItem, RiskItem, ReadinessScoreBreakdown, ReadinessStatus, AnalysisResult } from '../types';

export interface AuditResult {
  readinessScore: number;
  readinessStatus: ReadinessStatus;
  breakdown: ReadinessScoreBreakdown;
  risks: RiskItem[];
  hasCycle: boolean;
  cycleNodes: string[];
}

export function auditExecutionGraph(
  tasks: TaskItem[],
  dependencies: DependencyItem[],
  existingRisks: RiskItem[] = []
): AuditResult {
  const risks: RiskItem[] = [];
  const penalties: { reason: string; points: number }[] = [];
  let baseScore = 100;

  // 1. Cycle Detection (DFS for Circular Dependencies)
  const adjList = new Map<string, string[]>();
  tasks.forEach(t => adjList.set(t.id, []));
  dependencies.forEach(d => {
    if (adjList.has(d.fromTaskId)) {
      adjList.get(d.fromTaskId)!.push(d.toTaskId);
    }
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();
  let hasCycle = false;
  const cycleNodes: string[] = [];

  function dfsCycle(node: string, currentPath: string[]): boolean {
    visited.add(node);
    recStack.add(node);
    currentPath.push(node);

    const neighbors = adjList.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfsCycle(neighbor, [...currentPath])) return true;
      } else if (recStack.has(neighbor)) {
        hasCycle = true;
        cycleNodes.push(...currentPath, neighbor);
        return true;
      }
    }

    recStack.delete(node);
    return false;
  }

  tasks.forEach(t => {
    if (!visited.has(t.id)) {
      dfsCycle(t.id, []);
    }
  });

  if (hasCycle) {
    penalties.push({ reason: "Circular dependency detected in execution graph", points: -30 });
    risks.push({
      id: `risk-cycle-${Date.now()}`,
      riskType: "Circular Dependency",
      severity: "CRITICAL",
      title: "Deadlock: Circular Dependency Detected",
      description: "Tasks are locked in a circular dependency loop, making completion impossible without breaking the cycle.",
      evidence: "Cycle path detected across dependent tasks.",
      classification: "EXPLICIT",
      resolved: false
    });
  }

  // 2. Unassigned Task Auditor
  const unassignedTasks = tasks.filter(t => t.assignee === 'Unassigned' || !t.assignee);
  if (unassignedTasks.length > 0) {
    const penalty = unassignedTasks.length * 15;
    penalties.push({
      reason: `${unassignedTasks.length} task(s) missing assigned owners (${unassignedTasks.map(t => t.title).join(', ')})`,
      points: -penalty
    });

    unassignedTasks.forEach((t, idx) => {
      risks.push({
        id: `risk-unassigned-${idx}`,
        riskType: "Unassigned Deliverable",
        severity: "CRITICAL",
        title: `Unassigned Task: ${t.title}`,
        description: `Task "${t.title}" is a required deliverable but currently has no designated owner.`,
        evidence: t.source || "Explicitly identified as unassigned in project notes.",
        classification: "EXPLICIT",
        resolved: false
      });
    });
  }

  // 3. Resource Concentration / Bottleneck Detector
  const assigneeCounts = new Map<string, TaskItem[]>();
  tasks.forEach(t => {
    if (t.assignee && t.assignee !== 'Unassigned') {
      const list = assigneeCounts.get(t.assignee) || [];
      list.push(t);
      assigneeCounts.set(t.assignee, list);
    }
  });

  assigneeCounts.forEach((assignedTasks, person) => {
    if (assignedTasks.length >= 3) {
      penalties.push({
        reason: `Resource bottleneck: ${person} is assigned to ${assignedTasks.length} sequential tasks`,
        points: -12
      });

      risks.push({
        id: `risk-resource-${person}`,
        riskType: "Resource Bottleneck",
        severity: "CRITICAL",
        title: `Resource Concentration: ${person}`,
        description: `${person} is assigned to ${assignedTasks.length} critical deliverables (${assignedTasks.map(t => t.title).join(', ')}), creating single-point-of-failure risk.`,
        evidence: `${person} assigned to multiple dependent tasks in tight timeframe.`,
        classification: "INFERRED",
        resolved: false
      });
    }
  });

  // 4. Missing / Unspecified Deadline Auditor
  const unspecifiedDeadlines = tasks.filter(t => t.deadline === 'Unspecified' || !t.deadline);
  if (unspecifiedDeadlines.length > 0) {
    penalties.push({
      reason: `${unspecifiedDeadlines.length} task(s) with unspecified target deadlines`,
      points: -(unspecifiedDeadlines.length * 5)
    });
  }

  // Preserve existing risks if not duplicated
  existingRisks.forEach(er => {
    if (!risks.some(r => r.title === er.title)) {
      risks.push(er);
    }
  });

  // Compute Final Score
  const totalPenalties = penalties.reduce((sum, p) => sum + p.points, 0);
  let finalScore = Math.max(0, Math.min(100, baseScore + totalPenalties));

  let status: ReadinessStatus = 'READY';
  if (finalScore < 60) {
    status = 'BLOCKED';
  } else if (finalScore < 90) {
    status = 'READY WITH WARNINGS';
  }

  return {
    readinessScore: finalScore,
    readinessStatus: status,
    breakdown: {
      baseScore,
      penalties,
      finalScore,
      status
    },
    risks,
    hasCycle,
    cycleNodes
  };
}
