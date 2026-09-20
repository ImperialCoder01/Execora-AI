import { RememberInput, MemoryResult, RecallInput, MemorySearchResult } from './types';

export class CogneeClient {
  private baseUrl: string;
  private apiKey: string;
  private tenantId: string;
  private userId: string;

  constructor() {
    this.baseUrl = (process.env.COGNEE_BASE_URL || 'https://tenant-b4ea654e-84d5-4ba3-a3c7-333cc3e04fb1.aws.cognee.ai').replace(/\/+$/, '');
    this.apiKey = process.env.COGNEE_API_KEY || '';
    this.tenantId = process.env.COGNEE_TENANT_ID || 'b4ea654e-84d5-4ba3-a3c7-333cc3e04fb1';
    this.userId = process.env.COGNEE_USER_ID || 'ce41d096-ae42-4af1-84c0-8449e325b33b';
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-Api-Key': this.apiKey,
      'X-Tenant-Id': this.tenantId,
      'X-User-Id': this.userId
    };
  }

  public async remember(input: RememberInput): Promise<MemoryResult> {
    if (!this.isConfigured()) {
      throw new Error('Cognee API key is not configured.');
    }

    const dataset = input.datasetName || `execora_${input.projectId.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    const payload = {
      datasetName: dataset,
      data: input.text,
      metadata: {
        projectId: input.projectId,
        sourceName: input.sourceName || 'Direct Input',
        timestamp: new Date().toISOString(),
        ...input.metadata
      }
    };

    try {
      // Try /remember first (current memory-native API)
      let response = await fetch(`${this.baseUrl}/remember`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000)
      });

      if (!response.ok && response.status === 404) {
        // Fallback to lower-level /add endpoint if /remember is not routed on this environment
        response = await fetch(`${this.baseUrl}/add`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            data: [input.text],
            datasetName: dataset
          }),
          signal: AbortSignal.timeout(8000)
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cognee Cloud HTTP ${response.status}: ${errorText}`);
      }

      const resData = await response.json();
      return {
        success: true,
        projectId: input.projectId,
        datasetId: dataset,
        documentId: resData.id || resData.documentId || `doc_${Date.now()}`,
        message: 'Knowledge stored in Cognee connected project memory',
        timestamp: new Date().toISOString(),
        provider: 'cognee'
      };
    } catch (err: any) {
      console.warn(`[CogneeClient] Remember failed: ${err.message}`);
      throw err;
    }
  }

  public async recall(input: RecallInput): Promise<MemorySearchResult> {
    if (!this.isConfigured()) {
      throw new Error('Cognee API key is not configured.');
    }

    const dataset = input.datasetName || `execora_${input.projectId.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    const payload = {
      datasetName: dataset,
      query: input.query,
      topK: input.topK || 5
    };

    try {
      let response = await fetch(`${this.baseUrl}/recall`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000)
      });

      if (!response.ok && response.status === 404) {
        // Fallback to /search endpoint
        response = await fetch(`${this.baseUrl}/search`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            query: input.query,
            datasetName: dataset,
            searchType: 'INSIGHTS'
          }),
          signal: AbortSignal.timeout(8000)
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cognee Cloud HTTP ${response.status}: ${errorText}`);
      }

      const resData = await response.json();
      const rawResults = Array.isArray(resData) ? resData : (resData.results || resData.data || []);
      
      const results = rawResults.map((item: any, idx: number) => ({
        id: item.id || `recalled_${idx}`,
        text: typeof item === 'string' ? item : (item.text || item.content || item.summary || JSON.stringify(item)),
        score: item.score || 0.95 - (idx * 0.05),
        sourceName: item.sourceName || item.metadata?.sourceName || 'Cognee Memory Graph',
        relationship: item.relationship || item.relation || 'Connected Memory'
      }));

      return {
        success: true,
        query: input.query,
        results,
        provider: 'cognee',
        message: `Retrieved ${results.length} connected memory nodes from Cognee`
      };
    } catch (err: any) {
      console.warn(`[CogneeClient] Recall failed: ${err.message}`);
      throw err;
    }
  }
}
