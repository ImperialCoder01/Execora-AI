export interface RememberInput {
  projectId: string;
  datasetName?: string;
  text: string;
  sourceName?: string;
  metadata?: Record<string, any>;
}

export interface MemoryResult {
  success: boolean;
  projectId: string;
  datasetId?: string;
  documentId?: string;
  message: string;
  timestamp?: string;
  provider: 'cognee' | 'fallback';
}

export interface RecallInput {
  projectId: string;
  datasetName?: string;
  query: string;
  topK?: number;
}

export interface MemorySearchResultItem {
  id: string;
  text: string;
  score: number;
  sourceName?: string;
  metadata?: Record<string, any>;
  relationship?: string;
}

export interface MemorySearchResult {
  success: boolean;
  query: string;
  results: MemorySearchResultItem[];
  provider: 'cognee' | 'fallback';
  message?: string;
}

export interface ImproveInput {
  projectId: string;
  feedback: string;
  targetId?: string;
}

export interface ForgetInput {
  projectId: string;
  documentId: string;
}

export interface ProjectMemoryProvider {
  name: string;
  remember(input: RememberInput): Promise<MemoryResult>;
  recall(input: RecallInput): Promise<MemorySearchResult>;
  improve?(input: ImproveInput): Promise<MemoryResult>;
  forget?(input: ForgetInput): Promise<MemoryResult>;
}
