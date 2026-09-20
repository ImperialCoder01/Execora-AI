import { GroqClient } from './client';
import { RISK_EXPLANATION_PROMPT } from './prompts';

export async function explainExecutionRisks(graphData: any, auditData: any): Promise<string> {
  const groq = new GroqClient();
  if (!groq.isConfigured()) {
    return 'Execution risk explanation generated from deterministic audit rules (Groq API Key not configured).';
  }

  const prompt = `Analyze this execution graph and audit results:\nGraph: ${JSON.stringify(graphData)}\nAudit: ${JSON.stringify(auditData)}`;

  try {
    return await groq.complete(prompt, RISK_EXPLANATION_PROMPT, false);
  } catch (err: any) {
    return `Deterministic Audit Explanation: ${auditData?.penalties?.map((p: any) => p.reason).join('; ') || 'Graph evaluated cleanly.'}`;
  }
}
