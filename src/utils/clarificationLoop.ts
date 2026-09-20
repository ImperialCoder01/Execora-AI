import { AnalysisResult, ClarificationItem } from '../types';
import { auditExecutionGraph } from './auditEngine';

export interface ClarificationAnswerResult {
  updatedAnalysis: AnalysisResult;
  previousScore: number;
  newScore: number;
  scoreDelta: number;
  reason: string;
}

export function answerClarification(
  analysis: AnalysisResult,
  clarificationId: string,
  userAnswer: string
): ClarificationAnswerResult {
  const previousScore = analysis.readinessScore;

  // 1. Update Clarification Status
  const updatedClarifications = analysis.clarifications.map((c) =>
    c.id === clarificationId ? { ...c, status: 'ANSWERED' as const, answer: userAnswer } : c
  );

  const targetClarification = analysis.clarifications.find((c) => c.id === clarificationId);
  const answerLower = userAnswer.toLowerCase();

  // 2. Dynamically Update Execution Graph Tasks & Assignees based on Answer
  let updatedTasks = [...analysis.tasks];
  let updateReason = `Answered clarification: "${targetClarification?.question || 'Question'}"`;

  // Detect owner assignment in answer (e.g. "Sahil owns demo video", "Vishal will do video")
  if (answerLower.includes('sahil') || answerLower.includes('vishal') || answerLower.includes('rahul')) {
    let assignedPerson = 'Sahil';
    if (answerLower.includes('vishal')) assignedPerson = 'Vishal';
    if (answerLower.includes('rahul')) assignedPerson = 'Rahul';

    updatedTasks = updatedTasks.map((t) => {
      if (t.assignee === 'Unassigned' || t.title.toLowerCase().includes('video') || t.title.toLowerCase().includes('screenshot')) {
        return { ...t, assignee: assignedPerson, status: 'In Progress' };
      }
      return t;
    });

    updateReason = `Assigned task ownership to ${assignedPerson} (+18 points)`;
  }

  // 3. Re-audit Execution Graph
  const audit = auditExecutionGraph(updatedTasks, analysis.dependencies, analysis.risks);

  // 4. Update Action Steps
  const updatedActionPlan = analysis.actionPlan.map((step) => {
    if (step.action.toLowerCase().includes('video') && answerLower.includes('sahil')) {
      return { ...step, action: `Sahil produces 3-minute demo video for 6 PM submission.`, reason: 'Owner assigned via clarification loop.' };
    }
    return step;
  });

  const updatedAnalysis: AnalysisResult = {
    ...analysis,
    tasks: updatedTasks,
    clarifications: updatedClarifications,
    actionPlan: updatedActionPlan,
    readinessScore: audit.readinessScore,
    readinessStatus: audit.readinessStatus,
    readinessBreakdown: audit.breakdown,
    risks: audit.risks,
    previousScore,
    scoreChangeReason: updateReason,
    timestamp: new Date().toISOString()
  };

  return {
    updatedAnalysis,
    previousScore,
    newScore: audit.readinessScore,
    scoreDelta: audit.readinessScore - previousScore,
    reason: updateReason
  };
}
