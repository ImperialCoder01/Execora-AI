import { ReadinessScoreBreakdown, ReadinessStatus, TaskItem, DependencyItem, RiskItem } from '../../types';

export function calculateReadinessScore(
  tasks: TaskItem[],
  dependencies: DependencyItem[],
  risks: RiskItem[],
  cycles: string[][] = []
): ReadinessScoreBreakdown {
  let score = 100;
  const penalties: { reason: string; points: number }[] = [];

  // 1. Circular dependencies (-25)
  if (cycles.length > 0) {
    score -= 25;
    penalties.push({
      reason: `Circular dependency detected in execution graph (${cycles.length} cycle(s))`,
      points: 25
    });
  }

  // 2. Missing owner / unassigned critical tasks (-15)
  const unassigned = tasks.filter(t => !t.assignee || t.assignee.toLowerCase() === 'unassigned');
  if (unassigned.length > 0) {
    const pts = 15;
    score -= pts;
    penalties.push({
      reason: `${unassigned.length} critical task(s) have no assigned owner (${unassigned.map(t => t.title).join(', ')})`,
      points: pts
    });
  }

  // 3. Resource overload / concentration (-10)
  const assigneeCounts = new Map<string, number>();
  tasks.forEach(t => {
    if (t.assignee && t.assignee.toLowerCase() !== 'unassigned') {
      assigneeCounts.set(t.assignee, (assigneeCounts.get(t.assignee) || 0) + 1);
    }
  });
  assigneeCounts.forEach((count, assignee) => {
    if (count >= 3) {
      score -= 10;
      penalties.push({
        reason: `${assignee} is concentrated across ${count} sequential technical tasks`,
        points: 10
      });
    }
  });

  // 4. Critical unresolved blockers (-20)
  const criticalRisks = risks.filter(r => r.severity === 'CRITICAL' && !r.resolved);
  if (criticalRisks.length > 0) {
    score -= 20;
    penalties.push({
      reason: `${criticalRisks.length} unresolved critical execution blocker(s)`,
      points: 20
    });
  }

  // 5. Ambiguous deadline (-5)
  const ambiguousDeadlines = tasks.filter(t => t.deadline && (t.deadline.includes('Review') || t.deadline.includes('Cutoff') || t.deadline.toLowerCase().includes('today')));
  if (ambiguousDeadlines.length > 0) {
    score -= 5;
    penalties.push({
      reason: `Time-sensitive deadline ambiguity detected (${ambiguousDeadlines.length} item(s))`,
      points: 5
    });
  }

  const finalScore = Math.max(0, Math.min(100, score));
  let status: ReadinessStatus = 'READY';
  if (finalScore < 60) {
    status = 'BLOCKED';
  } else if (finalScore < 90) {
    status = 'READY WITH WARNINGS';
  }

  return {
    baseScore: 100,
    penalties,
    finalScore,
    status
  };
}
