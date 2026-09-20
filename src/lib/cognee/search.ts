import { CogneeMemoryProvider } from './memory';
import { RecallInput, MemorySearchResult } from './types';

const provider = new CogneeMemoryProvider();

export async function rememberProjectFact(projectId: string, text: string, sourceName?: string): Promise<any> {
  return provider.remember({
    projectId,
    text,
    sourceName,
    metadata: { source: 'Execora Ingestion' }
  });
}

export async function recallProjectFacts(projectId: string, query: string, topK: number = 5): Promise<MemorySearchResult> {
  return provider.recall({
    projectId,
    query,
    topK
  });
}
