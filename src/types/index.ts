export type PriorityLevel = 'High' | 'Medium' | 'Low' | 'Unspecified';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Unspecified';
export type EvidenceClassification = 'EXPLICIT' | 'INFERRED' | 'UNKNOWN';
export type RelationshipType = 'depends_on' | 'assigned_to' | 'blocks' | 'requires' | 'produces' | 'precedes' | 'conflicts_with';
export type RiskSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ReadinessStatus = 'READY' | 'READY WITH WARNINGS' | 'BLOCKED';
export type ClarificationPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  priority: PriorityLevel;
  deadline: string;
  status: TaskStatus;
  source: string;
  durationHours?: number;
}

export interface DeadlineItem {
  id?: string;
  event: string;
  date: string;
  time: string;
  source: string;
}

export interface DecisionItem {
  id?: string;
  decision: string;
  source: string;
}

export interface EntityItem {
  id?: string;
  name: string;
  type: 'Person' | 'Team' | 'Tool' | 'Date' | 'Other';
  source?: string;
}

export interface DependencyItem {
  id: string;
  fromTaskId: string;
  toTaskId: string;
  relationshipType: RelationshipType;
  confidenceType: EvidenceClassification;
  source: string;
}

export interface RiskItem {
  id: string;
  riskType: string;
  severity: RiskSeverity;
  title: string;
  description: string;
  evidence: string;
  classification: EvidenceClassification;
  resolved: boolean;
}

export interface ClarificationItem {
  id: string;
  question: string;
  reason: string;
  impact: ClarificationPriority;
  priority: number;
  status: 'OPEN' | 'ANSWERED';
  answer?: string;
}

export interface MissingInformationItem {
  id?: string;
  item: string;
  reason: string;
  impact?: ClarificationPriority;
}

export interface ActionStep {
  step: number;
  taskId?: string;
  action: string;
  reason: string;
  dependency: string;
  risk?: string;
  isApproved?: boolean;
}

export interface ScenarioResult {
  id?: string;
  scenarioId?: string;
  name: string;
  description: string;
  readinessScore: number;
  readinessStatus: ReadinessStatus;
  affectedTasks: string[];
  affectedPeople: string[];
  criticalPathChanged: boolean;
  recommendation: string;
  created_at?: string;
}

export interface ReadinessScoreBreakdown {
  baseScore: number;
  penalties: {
    reason: string;
    points: number;
  }[];
  finalScore: number;
  status: ReadinessStatus;
}

export interface AnalysisResult {
  id?: string;
  summary: string;
  tasks: TaskItem[];
  deadlines: DeadlineItem[];
  decisions: DecisionItem[];
  entities: EntityItem[];
  dependencies: DependencyItem[];
  risks: RiskItem[];
  clarifications: ClarificationItem[];
  missingInformation?: MissingInformationItem[];
  actionPlan: ActionStep[];
  readinessScore: number;
  readinessStatus: ReadinessStatus;
  readinessBreakdown: ReadinessScoreBreakdown;
  scenarios?: ScenarioResult[];
  confidence: number;
  confidenceReason: string;
  timestamp?: string;
  isDemo?: boolean;
  previousScore?: number;
  scoreChangeReason?: string;
}

export interface GroundedQAResponse {
  question: string;
  answer: string;
  type: 'FACT' | 'RECOMMENDATION' | 'MIXED' | 'UNAVAILABLE';
  sources: string[];
  isGrounded: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  meta?: {
    type?: 'FACT' | 'RECOMMENDATION' | 'MIXED' | 'UNAVAILABLE';
    sources?: string[];
  };
}
