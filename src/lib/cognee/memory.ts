import { ProjectMemoryProvider, RememberInput, MemoryResult, RecallInput, MemorySearchResult } from './types';
import { CogneeClient } from './client';
import { FallbackMemoryProvider } from './fallback';

export class CogneeMemoryProvider implements ProjectMemoryProvider {
  public name = 'cognee';
  private client: CogneeClient;
  private fallback: FallbackMemoryProvider;

  constructor() {
    this.client = new CogneeClient();
    this.fallback = new FallbackMemoryProvider();
  }

  public async remember(input: RememberInput): Promise<MemoryResult> {
    if (!this.client.isConfigured()) {
      console.log('[CogneeMemoryProvider] Cognee not configured. Using FallbackMemoryProvider.');
      return this.fallback.remember(input);
    }

    try {
      return await this.client.remember(input);
    } catch (err: any) {
      console.warn(`[CogneeMemoryProvider] Falling back to local memory store due to error: ${err.message}`);
      const res = await this.fallback.remember(input);
      return {
        ...res,
        message: `Cognee Cloud error (${err.message}). Stored in fallback memory store.`
      };
    }
  }

  public async recall(input: RecallInput): Promise<MemorySearchResult> {
    if (!this.client.isConfigured()) {
      return this.fallback.recall(input);
    }

    try {
      return await this.client.recall(input);
    } catch (err: any) {
      console.warn(`[CogneeMemoryProvider] Falling back to local memory recall due to error: ${err.message}`);
      const res = await this.fallback.recall(input);
      return {
        ...res,
        message: `Cognee Cloud recall notice: ${err.message}. Using local memory graph results.`
      };
    }
  }
}
