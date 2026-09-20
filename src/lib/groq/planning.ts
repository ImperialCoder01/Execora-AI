import { GroqClient } from './client';
import { ActionStep } from '../../types';

export async function generateActionablePlan(tasks: any[], dependencies: any[]): Promise<ActionStep[]> {
  const groq = new GroqClient();
  if (!groq.isConfigured()) {
    // Generate dependency-aware deterministic plan
    return tasks.map((t, idx) => ({
      step: idx + 1,
      taskId: t.id,
      action: t.title,
      reason: `Assigned to ${t.assignee}. Priority: ${t.priority}.`,
      dependency: dependencies.find(d => d.toTaskId === t.id)?.fromTaskId || 'None'
    }));
  }

  const prompt = `Generate a step-by-step execution plan for these tasks: ${JSON.stringify(tasks)} and dependencies: ${JSON.stringify(dependencies)}`;

  try {
    const raw = await groq.complete(prompt, 'You are an execution planning assistant. Return a JSON object with key "plan" containing an array of step objects.', true);
    const parsed = JSON.parse(raw);
    return parsed.plan || parsed;
  } catch (err) {
    return tasks.map((t, idx) => ({
      step: idx + 1,
      taskId: t.id,
      action: t.title,
      reason: `Sequential execution step ${idx + 1}`,
      dependency: 'None'
    }));
  }
}
