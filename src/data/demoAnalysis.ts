import { AnalysisResult } from '../types';

export const DEMO_RAW_TEXT = `AI Day hackathon preparation meeting.

Our final submission is tomorrow at 6 PM.
Vishal will finish the frontend and integrate the dashboard.
Rahul will fix the two unresolved API issues.
Rahul will test the backend API after the fixes.
Rahul will deploy the application.
Sahil needs to prepare the presentation.
The presentation needs screenshots from the deployed application.
The demo video still needs to be completed but nobody has been assigned to it yet.
There will be a team review at 4 PM today.
Rahul is available for development work until 3:30 PM today.
The final demo starts at 4:30 PM.
We should prioritize fixing the API issues before the final demo.`;

export const DEMO_ANALYSIS: AnalysisResult = {
  summary: "AI Day hackathon sync outlining critical tasks leading to 4 PM team review today and 6 PM final submission tomorrow. Critical execution dependencies identified from Rahul (API Fix → Testing → Deployment) to Sahil (Screenshots → Presentation). Unassigned risk detected for Demo Video.",
  tasks: [
    {
      id: "task-1",
      title: "Fix two unresolved backend API issues",
      description: "Rahul must resolve the two known backend API issues before testing can proceed.",
      assignee: "Rahul",
      priority: "High",
      deadline: "Today 3:30 PM",
      status: "In Progress",
      source: "Rahul will fix the two unresolved API issues.",
      durationHours: 2.5
    },
    {
      id: "task-2",
      title: "Test backend API end-to-end",
      description: "Comprehensive testing of backend endpoints after API issues are resolved.",
      assignee: "Rahul",
      priority: "High",
      deadline: "Today 4:00 PM Review",
      status: "Pending",
      source: "Rahul will test the backend API after the fixes.",
      durationHours: 1.0
    },
    {
      id: "task-3",
      title: "Deploy application to production host",
      description: "Deploy backend API and frontend static assets to live staging server.",
      assignee: "Rahul",
      priority: "High",
      deadline: "Tomorrow 12:00 PM",
      status: "Pending",
      source: "Rahul will deploy the application.",
      durationHours: 1.5
    },
    {
      id: "task-4",
      title: "Finish frontend dashboard integration",
      description: "Complete UI dashboard components and wire up to backend endpoints.",
      assignee: "Vishal",
      priority: "High",
      deadline: "Tomorrow 6:00 PM",
      status: "In Progress",
      source: "Vishal will finish the frontend and integrate the dashboard.",
      durationHours: 4.0
    },
    {
      id: "task-5",
      title: "Capture production screenshots from deployed app",
      description: "Take high-res screenshots of live UI for presentation deck.",
      assignee: "Sahil",
      priority: "High",
      deadline: "Tomorrow 2:00 PM",
      status: "Pending",
      source: "The presentation needs screenshots from the deployed application.",
      durationHours: 0.5
    },
    {
      id: "task-6",
      title: "Prepare final presentation deck",
      description: "Create pitch deck covering problem statement, architecture, AI workflow, and future scope.",
      assignee: "Sahil",
      priority: "High",
      deadline: "Tomorrow 4:00 PM",
      status: "Pending",
      source: "Sahil needs to prepare the presentation.",
      durationHours: 3.0
    },
    {
      id: "task-7",
      title: "Produce 3-minute hackathon demo video",
      description: "Record and edit 3-minute video walk-through for submission.",
      assignee: "Unassigned",
      priority: "High",
      deadline: "Tomorrow 6:00 PM",
      status: "Pending",
      source: "The demo video still needs to be completed but nobody has been assigned to it yet.",
      durationHours: 2.0
    }
  ],
  deadlines: [
    {
      event: "Rahul Development Availability Cutoff",
      date: "Today",
      time: "3:30 PM",
      source: "Rahul is available for development work until 3:30 PM today."
    },
    {
      event: "Team Review Meeting",
      date: "Today",
      time: "4:00 PM",
      source: "There will be a team review at 4 PM today."
    },
    {
      event: "Final Demo",
      date: "Today",
      time: "4:30 PM",
      source: "The final demo starts at 4:30 PM."
    },
    {
      event: "Final Hackathon Submission",
      date: "Tomorrow",
      time: "6:00 PM",
      source: "Our final submission is tomorrow at 6 PM."
    }
  ],
  decisions: [
    {
      decision: "Prioritize fixing the API issues before the final demo",
      source: "We should prioritize fixing the API issues before the final demo."
    }
  ],
  entities: [
    { name: "Rahul", type: "Person" },
    { name: "Vishal", type: "Person" },
    { name: "Sahil", type: "Person" },
    { name: "Backend API", type: "Tool" },
    { name: "Frontend Dashboard", type: "Tool" },
    { name: "AI Day Hackathon", type: "Other" }
  ],
  dependencies: [
    {
      id: "dep-1",
      fromTaskId: "task-1",
      toTaskId: "task-2",
      relationshipType: "depends_on",
      confidenceType: "EXPLICIT",
      source: "Rahul will test the backend API after the fixes."
    },
    {
      id: "dep-2",
      fromTaskId: "task-2",
      toTaskId: "task-3",
      relationshipType: "depends_on",
      confidenceType: "EXPLICIT",
      source: "Rahul will deploy the application."
    },
    {
      id: "dep-3",
      fromTaskId: "task-3",
      toTaskId: "task-5",
      relationshipType: "requires",
      confidenceType: "EXPLICIT",
      source: "The presentation needs screenshots from the deployed application."
    },
    {
      id: "dep-4",
      fromTaskId: "task-5",
      toTaskId: "task-6",
      relationshipType: "precedes",
      confidenceType: "EXPLICIT",
      source: "The presentation needs screenshots from the deployed application."
    }
  ],
  risks: [
    {
      id: "risk-1",
      riskType: "Resource Bottleneck",
      severity: "CRITICAL",
      title: "Rahul Resource Concentration Risk",
      description: "Rahul is assigned to 3 consecutive critical-path tasks (API Fix → API Testing → Deployment) with only 3 hours available before 3:30 PM cutoff.",
      evidence: "Rahul will fix API issues... Rahul will test backend API... Rahul is available until 3:30 PM.",
      classification: "INFERRED",
      resolved: false
    },
    {
      id: "risk-2",
      riskType: "Unassigned Deliverable",
      severity: "CRITICAL",
      title: "Demo Video Unassigned Owner",
      description: "The 3-minute hackathon demo video is mandatory for submission tomorrow at 6 PM but currently has no assigned owner.",
      evidence: "The demo video still needs to be completed but nobody has been assigned to it yet.",
      classification: "EXPLICIT",
      resolved: false
    },
    {
      id: "risk-3",
      riskType: "Tight Deadline Window",
      severity: "HIGH",
      title: "Presentation Screenshot Dependency",
      description: "Presentation deck requires production screenshots, creating a strict dependency chain from Deployment → Screenshots → Presentation.",
      evidence: "The presentation needs screenshots from the deployed application.",
      classification: "EXPLICIT",
      resolved: false
    }
  ],
  clarifications: [
    {
      id: "clarify-1",
      question: "Who will own the 3-minute Demo Video production?",
      reason: "Demo video is a critical submission requirement currently unassigned.",
      impact: "HIGH",
      priority: 1,
      status: "OPEN"
    },
    {
      id: "clarify-2",
      question: "Who will take screenshots from the deployed app for Sahil's presentation?",
      reason: "Sahil needs screenshots before finalizing slides, but screenshot ownership is not specified.",
      impact: "MEDIUM",
      priority: 2,
      status: "OPEN"
    }
  ],
  readinessScore: 62,
  readinessStatus: "BLOCKED",
  readinessBreakdown: {
    baseScore: 100,
    penalties: [
      { reason: "Unassigned critical deliverable (Demo Video)", points: -18 },
      { reason: "Resource concentration bottleneck (Rahul assigned 3 sequential tasks)", points: -12 },
      { reason: "Tight 3:30 PM availability window before 4 PM review", points: -8 }
    ],
    finalScore: 62,
    status: "BLOCKED"
  },
  actionPlan: [
    {
      step: 1,
      taskId: "task-1",
      action: "Assign Rahul to resolve the 2 known backend API issues immediately before 3:30 PM.",
      reason: "API stability is an absolute prerequisite for testing and deployment.",
      dependency: "None"
    },
    {
      step: 2,
      taskId: "task-7",
      action: "Assign an owner for Demo Video creation during the 4 PM team review.",
      reason: "Demo video is unassigned but mandatory for submission tomorrow at 6 PM.",
      dependency: "Team Review at 4 PM"
    },
    {
      step: 3,
      taskId: "task-3",
      action: "Execute production deployment as soon as API testing passes.",
      reason: "Enables live staging URL for Sahil to capture presentation screenshots.",
      dependency: "API Testing (Task 2)"
    },
    {
      step: 4,
      taskId: "task-6",
      action: "Sahil embeds screenshots and finalizes pitch deck.",
      reason: "Presentation deck must align with final deployed features.",
      dependency: "Deployment (Task 3) & Screenshots (Task 5)"
    }
  ],
  scenarios: [
    {
      id: "scen-1",
      name: "Rahul Delayed by 1 Hour",
      description: "Simulates a 1-hour delay in resolving the backend API issues.",
      readinessScore: 48,
      readinessStatus: "BLOCKED",
      affectedTasks: [
        "Fix two unresolved backend API issues",
        "Test backend API end-to-end",
        "Deploy application to production host",
        "Capture production screenshots"
      ],
      affectedPeople: ["Rahul", "Sahil"],
      criticalPathChanged: true,
      recommendation: "Reassign deployment or API testing to Vishal so Rahul can focus solely on API bug fixing before 3:30 PM."
    }
  ],
  confidence: 94,
  confidenceReason: "High clarity in task dependencies and explicit deadlines; gap identified for unassigned video owner.",
  timestamp: new Date().toISOString(),
  isDemo: true
};
