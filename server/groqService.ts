import Groq from 'groq-sdk';
import { AnalysisResult, GroundedQAResponse } from '../src/types';
import { validateAndSanitizeAnalysis } from '../src/utils/validator';

export class GroqService {
  private defaultClient: Groq | null = null;
  private model: string;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    this.model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    
    if (apiKey && apiKey.trim() !== '') {
      this.defaultClient = new Groq({ apiKey });
    }
  }

  public isConfigured(userApiKey?: string): boolean {
    if (userApiKey && userApiKey.trim() !== '') return true;
    return this.defaultClient !== null;
  }

  public getModel(): string {
    return this.model;
  }

  private getClient(userApiKey?: string): Groq {
    if (userApiKey && userApiKey.trim() !== '') {
      return new Groq({ apiKey: userApiKey.trim() });
    }
    if (this.defaultClient) {
      return this.defaultClient;
    }
    throw new Error("Groq API key is not configured.");
  }

  public async analyzeText(text: string, userApiKey?: string): Promise<AnalysisResult> {
    const client = this.getClient(userApiKey);

    const systemPrompt = `You are Execora AI, an elite AI Execution Readiness Engine.
Your job is to analyze unstructured information (meeting notes, emails, PRDs, task lists) and build a structured execution graph with risk audits, dependency mapping, and high-impact clarification questions.

CRITICAL HALLUCINATION & GROUNDING RULES:
1. NEVER invent facts, assignees, deadlines, or decisions not present in text.
2. Label missing assignees as "Unassigned" and missing deadlines as "Unspecified".
3. Map explicit dependencies between tasks with exact relationship types (depends_on, requires, precedes).
4. Identify missing owners, tight timelines, or resource concentration risks.
5. Generate high-value clarification questions prioritized by impact (HIGH, MEDIUM, LOW).
6. Label relationship confidence as EXPLICIT, INFERRED, or UNKNOWN.

Respond strictly with a valid JSON object matching this schema:
{
  "summary": "Executive synthesis of input content",
  "tasks": [
    {
      "id": "task-1",
      "title": "Clear task title",
      "description": "Task description",
      "assignee": "Person/Team name or Unassigned",
      "priority": "High | Medium | Low | Unspecified",
      "deadline": "Date/Time string or Unspecified",
      "status": "Pending | In Progress | Completed | Unspecified",
      "source": "Exact quote from text",
      "durationHours": 1.5
    }
  ],
  "deadlines": [
    {
      "event": "Event title",
      "date": "Extracted date or Unspecified",
      "time": "Extracted time or Unspecified",
      "source": "Exact quote from text"
    }
  ],
  "decisions": [
    {
      "decision": "Decision statement",
      "source": "Exact quote from text"
    }
  ],
  "entities": [
    {
      "name": "Entity name",
      "type": "Person | Team | Tool | Date | Other"
    }
  ],
  "dependencies": [
    {
      "id": "dep-1",
      "fromTaskId": "task-1",
      "toTaskId": "task-2",
      "relationshipType": "depends_on | requires | precedes | blocks",
      "confidenceType": "EXPLICIT | INFERRED | UNKNOWN",
      "source": "Quote supporting relationship"
    }
  ],
  "risks": [
    {
      "id": "risk-1",
      "riskType": "Resource Bottleneck | Unassigned Deliverable | Dependency Risk",
      "severity": "CRITICAL | HIGH | MEDIUM | LOW",
      "title": "Risk title",
      "description": "Risk description",
      "evidence": "Quote evidence",
      "classification": "EXPLICIT | INFERRED | UNKNOWN",
      "resolved": false
    }
  ],
  "clarifications": [
    {
      "id": "clarify-1",
      "question": "High impact clarification question?",
      "reason": "Why this question matters for readiness",
      "impact": "HIGH | MEDIUM | LOW",
      "priority": 1,
      "status": "OPEN"
    }
  ],
  "actionPlan": [
    {
      "step": 1,
      "taskId": "task-1",
      "action": "Concrete execution action",
      "reason": "Strategic rationale",
      "dependency": "Prerequisite step"
    }
  ],
  "confidence": 90,
  "confidenceReason": "Score explanation"
}`;

    try {
      const response = await client.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze the following content:\n\n---\n${text}\n---` }
        ],
        model: this.model,
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("Empty response received from Groq model.");

      const parsed = JSON.parse(content);
      return validateAndSanitizeAnalysis(parsed);
    } catch (error: any) {
      console.error("Groq API error during analysis:", error?.message || error);
      throw error;
    }
  }

  public async answerGroundedQuestion(
    originalText: string,
    analysis: AnalysisResult,
    question: string,
    userApiKey?: string
  ): Promise<GroundedQAResponse> {
    const client = this.getClient(userApiKey);

    const systemPrompt = `You are Execora AI's Grounded Execution Readiness Assistant.
Your job is to answer questions using ONLY the provided SOURCE CONTENT, EXECUTION GRAPH, AUDIT RISKS, and READINESS SCORE.

RULES:
1. Grounding: Answer strictly using facts present in the context.
2. Handling Uncertainty: If information is absent, state: "I don't have enough information to determine that from the provided content."
3. Fact vs Inference: Explicitly label facts as EXPLICIT and derived risks as INFERRED.

Return valid JSON:
{
  "question": "${question.replace(/"/g, '\\"')}",
  "answer": "Grounded answer paragraph",
  "type": "FACT | RECOMMENDATION | MIXED | UNAVAILABLE",
  "sources": ["Quote 1"],
  "isGrounded": true
}`;

    const contextContent = `
SOURCE CONTENT:
${originalText}

STRUCTURED ANALYSIS & READINESS ENGINE:
Summary: ${analysis.summary}
Readiness Score: ${analysis.readinessScore}% (${analysis.readinessStatus})
Tasks: ${JSON.stringify(analysis.tasks)}
Dependencies: ${JSON.stringify(analysis.dependencies)}
Risks: ${JSON.stringify(analysis.risks)}
Clarifications: ${JSON.stringify(analysis.clarifications)}
`;

    try {
      const response = await client.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `CONTEXT:\n${contextContent}\n\nUSER QUESTION:\n${question}` }
        ],
        model: this.model,
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("Empty response from Groq for chat question.");

      const parsed = JSON.parse(content);
      return {
        question,
        answer: parsed.answer || "Information unavailable in context.",
        type: ['FACT', 'RECOMMENDATION', 'MIXED', 'UNAVAILABLE'].includes(parsed.type) ? parsed.type : 'FACT',
        sources: Array.isArray(parsed.sources) ? parsed.sources : [],
        isGrounded: parsed.isGrounded !== false
      };
    } catch (error: any) {
      console.error("Groq Grounded Q&A error:", error?.message || error);
      throw error;
    }
  }
}
