import { DEMO_ANALYSIS, DEMO_RAW_TEXT } from './demoAnalysis';
import { AnalysisResult } from '../types';

export interface SamplePreset {
  id: string;
  title: string;
  category: string;
  text: string;
  analysis: AnalysisResult;
}

export const CLIENT_FEEDBACK_ANALYSIS: AnalysisResult = {
  summary: "Analyzed Sprint 14 Client Feedback & Security Requirements from Priya Sharma (Acme Corp). Extracted 4 tasks, 2 deadlines, 1 decision, and 1 high-priority clarification gap.",
  tasks: [
    {
      id: "task-client-1",
      title: "Complete OAuth2 refresh token fix",
      description: "Critical security compliance fix required before staging release.",
      assignee: "Amit",
      priority: "High",
      deadline: "Friday 5:00 PM",
      status: "In Progress",
      source: "Amit must complete the OAuth2 refresh token fix by Friday 5 PM. This is critical for security compliance.",
      durationHours: 4.0
    },
    {
      id: "task-client-2",
      title: "Lead design review for new analytics dashboard",
      description: "Design review session with product lead.",
      assignee: "Neha",
      priority: "Medium",
      deadline: "Wednesday 2:00 PM",
      status: "Pending",
      source: "Neha will lead the design review for the new analytics dashboard on Wednesday at 2 PM.",
      durationHours: 2.0
    },
    {
      id: "task-client-3",
      title: "Test CSV data export on staging environment",
      description: "Dev team testing before client staging deployment.",
      assignee: "Dev Team",
      priority: "High",
      deadline: "Thursday EOD",
      status: "Pending",
      source: "Data export to CSV needs to be tested by Dev team before client staging deployment on Thursday.",
      durationHours: 3.0
    },
    {
      id: "task-client-4",
      title: "Update API documentation for v2 endpoint deprecation",
      description: "Document deprecation changes for client developer onboarding.",
      assignee: "Unassigned",
      priority: "High",
      deadline: "Friday EOD",
      status: "Pending",
      source: "Who is responsible for updating the API documentation for v2 endpoint deprecation?",
      durationHours: 2.5
    }
  ],
  deadlines: [
    {
      event: "Analytics Dashboard Design Review",
      date: "Wednesday",
      time: "2:00 PM",
      source: "Neha will lead the design review for the new analytics dashboard on Wednesday at 2 PM."
    },
    {
      event: "OAuth2 Refresh Token Fix Cutoff",
      date: "Friday",
      time: "5:00 PM",
      source: "Amit must complete the OAuth2 refresh token fix by Friday 5 PM."
    }
  ],
  decisions: [
    {
      decision: "Postpone mobile push notification feature to Q4 due to bandwidth constraints.",
      source: "We decided to postpone the mobile push notification feature to Q4 due to bandwidth constraints."
    }
  ],
  entities: [
    { name: "Priya Sharma", type: "Person", source: "From: Priya Sharma (Product Lead, Acme Corp)" },
    { name: "Amit", type: "Person", source: "Amit must complete the OAuth2 refresh token fix" },
    { name: "Neha", type: "Person", source: "Neha will lead the design review" },
    { name: "OAuth2 Refresh Token", type: "Tool", source: "OAuth2 refresh token fix" }
  ],
  dependencies: [
    {
      id: "dep-c1",
      fromTaskId: "task-client-1",
      toTaskId: "task-client-3",
      relationshipType: "precedes",
      confidenceType: "EXPLICIT",
      source: "OAuth2 token fix must be completed before CSV staging deployment."
    }
  ],
  risks: [
    {
      id: "risk-c1",
      riskType: "UNASSIGNED_TASK",
      severity: "CRITICAL",
      title: "API Documentation Owner Missing",
      description: "v2 endpoint deprecation docs have no assigned owner.",
      evidence: "Who is responsible for updating the API documentation for v2 endpoint deprecation?",
      classification: "EXPLICIT",
      resolved: false
    }
  ],
  clarifications: [
    {
      id: "clarification-c1",
      question: "Who will update the API documentation for v2 endpoint deprecation?",
      reason: "API documentation update is required for v2 deprecation but currently unassigned.",
      impact: "HIGH",
      priority: 1,
      status: "OPEN"
    }
  ],
  actionPlan: [
    {
      step: 1,
      taskId: "task-client-1",
      action: "Amit completes OAuth2 refresh token fix for security compliance.",
      reason: "Critical prerequisite for Thursday staging deployment.",
      dependency: "None"
    },
    {
      step: 2,
      taskId: "task-client-2",
      action: "Neha leads analytics dashboard design review.",
      reason: "Scheduled for Wednesday 2 PM.",
      dependency: "None"
    },
    {
      step: 3,
      taskId: "task-client-3",
      action: "Dev team tests CSV export before staging deployment.",
      reason: "Depends on token fix completion.",
      dependency: "OAuth2 Refresh Token Fix"
    }
  ],
  readinessScore: 68,
  readinessStatus: "READY WITH WARNINGS",
  readinessBreakdown: {
    baseScore: 100,
    penalties: [
      { reason: "1 critical task (v2 API Documentation) has no assigned owner", points: 15 },
      { reason: "High dependency on Thursday staging deployment deadline", points: 10 },
      { reason: "Time-sensitive security compliance cutoff", points: 7 }
    ],
    finalScore: 68,
    status: "READY WITH WARNINGS"
  },
  confidence: 91,
  confidenceReason: "Explicit deliverables with clear deadlines from client product lead.",
  timestamp: new Date().toISOString(),
  isDemo: true
};

export const INCIDENT_POSTMORTEM_ANALYSIS: AnalysisResult = {
  summary: "Analyzed Database Outage Incident Post-Mortem. Extracted 3 recovery tasks, 2 architectural decisions, 2 open monitoring gaps, and 3 engineer assignments.",
  tasks: [
    {
      id: "task-post-1",
      title: "Setup database read replicas",
      description: "Implement read replicas to prevent primary PostgreSQL query spikes.",
      assignee: "Vikram",
      priority: "High",
      deadline: "Sept 25",
      status: "In Progress",
      source: "Vikram needs to setup database read replicas by Sept 25.",
      durationHours: 6.0
    },
    {
      id: "task-post-2",
      title: "Implement Redis caching layer for user session lookups",
      description: "Offload session queries from PostgreSQL to Redis.",
      assignee: "Rohan",
      priority: "High",
      deadline: "Monday 10:00 AM",
      status: "Pending",
      source: "Rohan will implement Redis caching layer for user session lookups by Monday 10 AM.",
      durationHours: 4.5
    },
    {
      id: "task-post-3",
      title: "Draft customer post-mortem disclosure",
      description: "Write public RCA statement detailing downtime resolution.",
      assignee: "Sneha",
      priority: "Medium",
      deadline: "Tomorrow 12:00 PM",
      status: "Pending",
      source: "Sneha to draft customer post-mortem disclosure by tomorrow 12 PM.",
      durationHours: 2.0
    }
  ],
  deadlines: [
    {
      event: "Customer Post-Mortem Disclosure",
      date: "Tomorrow",
      time: "12:00 PM",
      source: "Sneha to draft customer post-mortem disclosure by tomorrow 12 PM."
    },
    {
      event: "Redis Caching Layer Deployment",
      date: "Monday",
      time: "10:00 AM",
      source: "Rohan will implement Redis caching layer for user session lookups by Monday 10 AM."
    }
  ],
  decisions: [
    {
      decision: "Implement query rate limiting on API gateway immediately.",
      source: "We agreed to implement query rate limiting on the API gateway immediately."
    },
    {
      decision: "Enforce mandatory SQL index checks in CI/CD pipeline.",
      source: "We decided to enforce mandatory SQL index checks in CI/CD pipeline."
    }
  ],
  entities: [
    { name: "Vikram", type: "Person", source: "Vikram needs to setup database read replicas" },
    { name: "Sneha", type: "Person", source: "Sneha to draft customer post-mortem disclosure" },
    { name: "Rohan", type: "Person", source: "Rohan will implement Redis caching layer" },
    { name: "Ananya", type: "Person", source: "Attendee: Ananya" }
  ],
  dependencies: [
    {
      id: "dep-p1",
      fromTaskId: "task-post-2",
      toTaskId: "task-post-1",
      relationshipType: "precedes",
      confidenceType: "INFERRED",
      source: "Redis caching layer offloads primary database load while read replicas are being configured."
    }
  ],
  risks: [
    {
      id: "risk-p1",
      riskType: "RESOURCE_BOTTLENECK",
      severity: "HIGH",
      title: "Weekend Alert Monitoring Unassigned",
      description: "No engineer assigned to monitor database alerts over the weekend.",
      evidence: "It is unclear who will monitor the alerts over the weekend.",
      classification: "EXPLICIT",
      resolved: false
    }
  ],
  clarifications: [
    {
      id: "clarification-p1",
      question: "Who will monitor the database alerts over the weekend?",
      reason: "Weekend alert monitoring is critical to prevent recurrence of downtime.",
      impact: "HIGH",
      priority: 1,
      status: "OPEN"
    },
    {
      id: "clarification-p2",
      question: "What is the retry logic for failed payment webhooks during downtime?",
      reason: "Failed webhooks during outage need automated retry handling to avoid lost revenue.",
      impact: "MEDIUM",
      priority: 2,
      status: "OPEN"
    }
  ],
  actionPlan: [
    {
      step: 1,
      taskId: "task-post-3",
      action: "Sneha drafts customer post-mortem disclosure statement.",
      reason: "High customer visibility item due tomorrow 12 PM.",
      dependency: "None"
    },
    {
      step: 2,
      taskId: "task-post-2",
      action: "Rohan implements Redis session caching layer.",
      reason: "Immediate load reduction on PostgreSQL cluster.",
      dependency: "None"
    },
    {
      step: 3,
      taskId: "task-post-1",
      action: "Vikram configures PostgreSQL read replicas.",
      reason: "Longer-term high availability architecture.",
      dependency: "Redis Caching Layer"
    }
  ],
  readinessScore: 74,
  readinessStatus: "READY WITH WARNINGS",
  readinessBreakdown: {
    baseScore: 100,
    penalties: [
      { reason: "Weekend alert monitoring coverage unassigned", points: 15 },
      { reason: "Unspecified webhook retry logic after primary database outage", points: 11 }
    ],
    finalScore: 74,
    status: "READY WITH WARNINGS"
  },
  confidence: 93,
  confidenceReason: "Post-mortem incident log with clear owner assignments and technical remediation steps.",
  timestamp: new Date().toISOString(),
  isDemo: true
};

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'hackathon-meeting',
    title: '🏆 Hackathon Prep Sync',
    category: 'Meeting Notes',
    text: DEMO_RAW_TEXT,
    analysis: DEMO_ANALYSIS
  },
  {
    id: 'client-feedback',
    title: '📧 Client Feedback & Scope Email',
    category: 'Email',
    text: `From: Priya Sharma (Product Lead, Acme Corp)
Subject: Re: Sprint 14 Deliverables & Security Audit Feedback

Hi Team,

Following up on our review yesterday. Here are the immediate requirements for next week:

1. Amit must complete the OAuth2 refresh token fix by Friday 5 PM. This is critical for security compliance.
2. Neha will lead the design review for the new analytics dashboard on Wednesday at 2 PM.
3. We decided to postpone the mobile push notification feature to Q4 due to bandwidth constraints.
4. Data export to CSV needs to be tested by Dev team before client staging deployment on Thursday.
5. Who is responsible for updating the API documentation for v2 endpoint deprecation? It wasn't discussed in the call.

Please confirm receiving these and update Jira.

Best,
Priya`,
    analysis: CLIENT_FEEDBACK_ANALYSIS
  },
  {
    id: 'incident-postmortem',
    title: '🚨 Incident Post-Mortem Notes',
    category: 'Engineering Sync',
    text: `Post-Mortem Meeting Notes: Database Outage 2026-09-18

Attendees: Vikram, Sneha, Rohan, Ananya

Summary:
Primary PostgreSQL cluster went down for 42 minutes due to unindexed query spike during promotional campaign.

Decisions:
- We agreed to implement query rate limiting on the API gateway immediately.
- We decided to enforce mandatory SQL index checks in CI/CD pipeline.

Tasks:
- Vikram needs to setup database read replicas by Sept 25.
- Rohan will implement Redis caching layer for user session lookups by Monday 10 AM.
- Sneha to draft customer post-mortem disclosure by tomorrow 12 PM.

Gaps & Unclear Items:
- It is unclear who will monitor the alerts over the weekend.
- We haven't specified the retry logic for failed payment webhooks during the downtime.`,
    analysis: INCIDENT_POSTMORTEM_ANALYSIS
  }
];
