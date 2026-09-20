import { ProjectMemoryProvider, RememberInput, MemoryResult, RecallInput, MemorySearchResult, MemorySearchResultItem } from './types';

interface StoredMemory {
  id: string;
  projectId: string;
  text: string;
  sourceName: string;
  metadata: Record<string, any>;
  timestamp: string;
}

export class FallbackMemoryProvider implements ProjectMemoryProvider {
  public name = 'fallback';
  private static store: Map<string, StoredMemory[]> = new Map();

  public async remember(input: RememberInput): Promise<MemoryResult> {
    const list = FallbackMemoryProvider.store.get(input.projectId) || [];
    const docId = `local_mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const entry: StoredMemory = {
      id: docId,
      projectId: input.projectId,
      text: input.text,
      sourceName: input.sourceName || 'Local Source',
      metadata: input.metadata || {},
      timestamp: new Date().toISOString()
    };

    list.push(entry);
    FallbackMemoryProvider.store.set(input.projectId, list);

    return {
      success: true,
      projectId: input.projectId,
      datasetId: `local_${input.projectId}`,
      documentId: docId,
      message: 'Knowledge stored in local fallback memory store',
      timestamp: entry.timestamp,
      provider: 'fallback'
    };
  }

  public async recall(input: RecallInput): Promise<MemorySearchResult> {
    const list = FallbackMemoryProvider.store.get(input.projectId) || [];
    const queryLower = input.query.toLowerCase();
    const queryTokens = queryLower.split(/\s+/).filter(t => t.length > 2);

    const scored = list.map(item => {
      const textLower = item.text.toLowerCase();
      let matchCount = 0;
      queryTokens.forEach(t => {
        if (textLower.includes(t)) matchCount++;
      });
      const score = queryTokens.length > 0 ? (matchCount / queryTokens.length) : 0.5;
      return { item, score };
    });

    // Sort by relevance score
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, input.topK || 5);

    const results: MemorySearchResultItem[] = top.map(({ item, score }, idx) => ({
      id: item.id,
      text: item.text,
      score: Math.max(0.4, Number((score > 0 ? score : (0.8 - idx * 0.1)).toFixed(2))),
      sourceName: item.sourceName,
      metadata: item.metadata,
      relationship: 'Local Memory Node'
    }));

    return {
      success: true,
      query: input.query,
      results,
      provider: 'fallback',
      message: `Retrieved ${results.length} memories from local fallback provider`
    };
  }
}
