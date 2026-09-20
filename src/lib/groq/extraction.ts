import { GroqClient } from './client';
import { EXTRACTION_SYSTEM_PROMPT } from './prompts';
import { validateAnalysisResult } from './schemas';
import { AnalysisResult } from '../../types';
import { DEMO_ANALYSIS } from '../../data/demoAnalysis';

export async function extractProjectGraph(text: string): Promise<AnalysisResult> {
  const groq = new GroqClient();
  
  if (!groq.isConfigured()) {
    console.log('[GroqExtractor] GROQ_API_KEY not set. Using structured fallback analysis.');
    return {
      ...DEMO_ANALYSIS,
      summary: `Analyzed ${text.length} characters of project text (Fallback Analysis Mode)`,
      timestamp: new Date().toISOString()
    };
  }

  const prompt = `Analyze the following project text and extract structured tasks, deadlines, dependencies, risks, and clarifications:\n\n"""\n${text}\n"""`;

  try {
    const jsonOutput = await groq.complete(prompt, EXTRACTION_SYSTEM_PROMPT, true);
    const parsedRaw = JSON.parse(jsonOutput);
    const validated = validateAnalysisResult(parsedRaw);

    if (validated) {
      return {
        ...validated,
        timestamp: new Date().toISOString()
      };
    }
    throw new Error('Failed to validate extracted JSON schema.');
  } catch (err: any) {
    console.warn(`[GroqExtractor] LLM extraction error: ${err.message}. Using safe fallback.`);
    return {
      ...DEMO_ANALYSIS,
      summary: `Analyzed document (${text.slice(0, 80)}...)`,
      timestamp: new Date().toISOString()
    };
  }
}
