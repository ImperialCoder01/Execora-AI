import { DEMO_RAW_TEXT } from './demoAnalysis';

export interface SamplePreset {
  id: string;
  title: string;
  category: string;
  text: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'hackathon-meeting',
    title: '🏆 Hackathon Prep Sync',
    category: 'Meeting Notes',
    text: DEMO_RAW_TEXT,
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
Priya`
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
- We haven't specified the retry logic for failed payment webhooks during the downtime.`
  }
];
