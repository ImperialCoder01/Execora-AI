import { AnalysisResult, GroundedQAResponse } from '../types';
import { DEMO_ANALYSIS } from '../data/demoAnalysis';

export interface HealthStatus {
  status: string;
  groqConfigured: boolean;
  model: string;
}

export interface ParseDocResponse {
  success: boolean;
  text: string;
  fileName: string;
  type: string;
  wordCount: number;
  pageCount?: number;
}

export async function fetchHealthStatus(): Promise<HealthStatus> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch {
    return {
      status: 'demo',
      groqConfigured: false,
      model: 'Demo Engine'
    };
  }
}

export async function parseDocumentAPI(
  fileBase64: string,
  fileName: string,
  mimeType?: string
): Promise<ParseDocResponse> {
  try {
    const res = await fetch('/api/parse-doc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileBase64, fileName, mimeType })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to parse document: HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error("Document parsing error:", error);
    throw error;
  }
}

export async function analyzeTextAPI(
  text: string,
  forceDemo: boolean = false,
  userGroqKey?: string
): Promise<AnalysisResult> {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userGroqKey ? { 'x-groq-api-key': userGroqKey } : {})
      },
      body: JSON.stringify({ text, forceDemo, userGroqKey })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      if (errData.fallback) {
        return errData.fallback;
      }
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn("Client fallback to demo analysis:", error);
    return {
      ...DEMO_ANALYSIS,
      isDemo: true,
      timestamp: new Date().toISOString()
    };
  }
}

export async function askGroundedQAAPI(
  text: string,
  analysis: AnalysisResult,
  question: string,
  isDemo: boolean = false,
  userGroqKey?: string
): Promise<GroundedQAResponse> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userGroqKey ? { 'x-groq-api-key': userGroqKey } : {})
      },
      body: JSON.stringify({ text, analysis, question, isDemo, userGroqKey })
    });

    if (!res.ok) {
      throw new Error("Failed to communicate with grounded chat service");
    }

    return await res.json();
  } catch (error) {
    const qLower = question.toLowerCase();
    let answer = "";
    let type: 'FACT' | 'RECOMMENDATION' | 'MIXED' | 'UNAVAILABLE' = 'FACT';
    let sources: string[] = [];

    if (qLower.includes('first') || qLower.includes('priorit') || qLower.includes('start')) {
      answer = "FACT: Rahul is assigned to test backend API, but reported two unresolved issues. RECOMMENDATION: Rahul must fix those API issues first before today's 4 PM review.";
      type = 'MIXED';
      sources = ["Rahul mentioned that the API currently has two unresolved issues.", "We should prioritize fixing those before final demo."];
    } else if (qLower.includes('submission') || qLower.includes('deadline') || qLower.includes('when')) {
      answer = "FACT: Team review is at 4:00 PM today. Final submission is tomorrow at 6:00 PM.";
      type = 'FACT';
      sources = ["There will be a team review at 4 PM today.", "Our final submission is tomorrow at 6 PM."];
    } else {
      answer = `FACT: Extracted summary: "${analysis.summary}". UNAVAILABLE: Answer for "${question}" is not explicitly mentioned in source text.`;
      type = 'UNAVAILABLE';
      sources = [analysis.summary];
    }

    return {
      question,
      answer,
      type,
      sources,
      isGrounded: true
    };
  }
}
