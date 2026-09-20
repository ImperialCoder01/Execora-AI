import { AnalysisResult, ScenarioResult, ReadinessStatus, TaskItem } from '../types';
import { auditExecutionGraph } from './auditEngine';

export type ScenarioType = 'TASK_DELAY' | 'PERSON_UNAVAILABLE' | 'BLOCKER_ADDED' | 'DEADLINE_MOVED';

export interface ScenarioParams {
  type: ScenarioType;
  personName?: string;
  delayHours?: number;
  taskId?: string;
  customDescription?: string;
}

export function runWhatIfSimulation(
  analysis: AnalysisResult,
  params: ScenarioParams
): ScenarioResult {
  const affectedTasks: string[] = [];
  const affectedPeople: string[] = [];
  let scorePenalty = 0;
  let recommendation = "";
  let name = "";
  let description = "";

  if (params.type === 'TASK_DELAY') {
    const delay = params.delayHours || 1;
    name = `Task Delay: ${delay} Hour(s)`;
    description = `Simulating a ${delay}-hour delay on critical-path backend development and testing.`;

    const delayedTask = analysis.tasks.find(t => t.id === params.taskId) || analysis.tasks[0];
    affectedTasks.push(delayedTask.title, "Test backend API end-to-end", "Deploy application", "Capture production screenshots");
    affectedPeople.push("Rahul", "Sahil");
    scorePenalty = 14;

    recommendation = `Reassign deployment or API testing tasks to Vishal to mitigate Rahul's 1-hour delay and preserve the 4:00 PM review deadline.`;
  } else if (params.type === 'PERSON_UNAVAILABLE') {
    const person = params.personName || 'Rahul';
    name = `Person Unavailable: ${person}`;
    description = `Simulating unexpected emergency unavailability of ${person}.`;

    const personTasks = analysis.tasks.filter(t => t.assignee === person);
    personTasks.forEach(t => affectedTasks.push(t.title));
    affectedPeople.push(person, "Vishal", "Sahil");
    scorePenalty = 28;

    recommendation = `Immediately reassign ${person}'s critical tasks to remaining team members to avoid complete project stall.`;
  } else if (params.type === 'BLOCKER_ADDED') {
    name = `Unplanned Blocker Added`;
    description = `Simulating an mandatory security audit gate added before production deployment.`;

    affectedTasks.push("Deploy application to production host", "Capture production screenshots", "Prepare final presentation deck");
    affectedPeople.push("Rahul", "Sahil");
    scorePenalty = 20;

    recommendation = `Execute pre-audit checklist immediately and run automated vulnerability scan in parallel with API bug fixes.`;
  } else {
    name = `Deadline Shifted 2 Hours Earlier`;
    description = `Simulating submission deadline moved 2 hours earlier.`;

    analysis.tasks.forEach(t => affectedTasks.push(t.title));
    affectedPeople.push("Rahul", "Vishal", "Sahil");
    scorePenalty = 25;

    recommendation = `Freeze non-essential UI features immediately; focus 100% of bandwidth on core API fixes and presentation slides.`;
  }

  const simulatedScore = Math.max(0, analysis.readinessScore - scorePenalty);
  let simulatedStatus: ReadinessStatus = 'READY';
  if (simulatedScore < 60) simulatedStatus = 'BLOCKED';
  else if (simulatedScore < 90) simulatedStatus = 'READY WITH WARNINGS';

  return {
    id: `scen-${Date.now()}`,
    name,
    description,
    readinessScore: simulatedScore,
    readinessStatus: simulatedStatus,
    affectedTasks,
    affectedPeople,
    criticalPathChanged: true,
    recommendation,
    created_at: new Date().toISOString()
  };
}
