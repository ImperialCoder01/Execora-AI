import { TaskItem, DependencyItem, ScenarioResult, ReadinessStatus } from '../../types';
import { calculateReadinessScore } from './readiness';

export function runWhatIfSimulation(
  person: string,
  delayHours: number,
  tasks: TaskItem[],
  dependencies: DependencyItem[]
): ScenarioResult {
  // Find person's tasks
  const personTasks = tasks.filter(t => t.assignee.toLowerCase() === person.toLowerCase());
  const affectedTaskTitles: string[] = personTasks.map(t => t.title);
  
  // Trace downstream dependent tasks
  personTasks.forEach(pt => {
    const dependents = dependencies.filter(d => d.fromTaskId === pt.id);
    dependents.forEach(d => {
      const downTask = tasks.find(t => t.id === d.toTaskId);
      if (downTask && !affectedTaskTitles.includes(downTask.title)) {
        affectedTaskTitles.push(downTask.title);
      }
    });
  });

  const affectedPeople = Array.from(new Set(
    tasks.filter(t => affectedTaskTitles.includes(t.title)).map(t => t.assignee)
  )).filter(p => p && p.toLowerCase() !== 'unassigned');

  // Recalculate score with delay impact
  const currentAudit = calculateReadinessScore(tasks, dependencies, []);
  let simulatedScore = currentAudit.finalScore;

  if (delayHours >= 2) {
    simulatedScore = Math.max(0, simulatedScore - 15);
  } else if (delayHours > 0) {
    simulatedScore = Math.max(0, simulatedScore - 10);
  }

  let status: ReadinessStatus = 'READY';
  if (simulatedScore < 60) status = 'BLOCKED';
  else if (simulatedScore < 90) status = 'READY WITH WARNINGS';

  const recommendation = affectedPeople.length > 1
    ? `Reassign downstream tasks from ${person} or shift test review window.`
    : `Notify ${person} to prioritize early API fixes before deadline.`;

  return {
    scenarioId: `sim_${Date.now()}`,
    name: `What if ${person} is delayed by ${delayHours} hour(s)?`,
    description: `Simulated a ${delayHours}-hour delay on tasks assigned to ${person}.`,
    readinessScore: simulatedScore,
    readinessStatus: status,
    affectedTasks: affectedTaskTitles,
    affectedPeople,
    criticalPathChanged: delayHours > 1,
    recommendation,
    created_at: new Date().toISOString()
  };
}
