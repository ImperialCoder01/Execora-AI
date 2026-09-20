import { AnalysisResult, TaskItem, DeadlineItem, DecisionItem, EntityItem, DependencyItem, RiskItem, ClarificationItem, ActionStep, PriorityLevel, TaskStatus } from '../types';
import { runDeterministicAudit } from '../lib/execution/audit';

export function parseCustomTextHeuristically(text: string): AnalysisResult {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  const tasks: TaskItem[] = [];
  const deadlines: DeadlineItem[] = [];
  const decisions: DecisionItem[] = [];
  const entities: EntityItem[] = [];
  const dependencies: DependencyItem[] = [];
  const risks: RiskItem[] = [];
  const clarifications: ClarificationItem[] = [];
  
  let taskCount = 0;
  
  // Common name patterns
  const nameMatches = text.match(/\b([A-Z][a-z]+)\b/g) || [];
  const candidateNames = Array.from(new Set(nameMatches)).filter(n => 
    !['Hi', 'Re', 'From', 'Subject', 'Thanks', 'Best', 'Team', 'Who', 'Where', 'When', 'What', 'Please', 'Post', 'Mortem', 'PostgreSQL', 'Jira', 'CSV', 'API', 'OAuth2', 'SQL', 'CI', 'CD', 'Redis', 'Q4'].includes(n)
  );

  candidateNames.forEach(name => {
    entities.push({
      name,
      type: 'Person',
      source: `Mentioned in text: ${name}`
    });
  });

  // Line-by-line parsing
  lines.forEach((line, idx) => {
    const lineLower = line.toLowerCase();

    // Detect Decision
    if (lineLower.includes('decided to') || lineLower.includes('agreed to') || lineLower.includes('postpone')) {
      decisions.push({
        decision: line.replace(/^[-*\d.]+\s*/, ''),
        source: line
      });
    }

    // Detect Deadline / Time
    const timeMatch = line.match(/\b(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))\b|\b(by\s+[A-Z][a-z]+|\b(Sept|Oct|Nov|Dec|Monday|Tuesday|Wednesday|Thursday|Friday)\b)/i);
    if (timeMatch) {
      deadlines.push({
        event: line.slice(0, 40).replace(/^[-*\d.]+\s*/, ''),
        date: timeMatch[0],
        time: timeMatch[1] || 'EOD',
        source: line
      });
    }

    // Detect Task
    const isTaskLine = /^\d+\.|\*|-|^[A-Z][a-z]+\s+(must|will|to|needs|should)/i.test(line) || lineLower.includes('fix') || lineLower.includes('lead') || lineLower.includes('implement') || lineLower.includes('draft') || lineLower.includes('setup') || lineLower.includes('test');
    if (isTaskLine && !lineLower.startsWith('from:') && !lineLower.startsWith('subject:')) {
      taskCount++;
      const taskId = `task-${taskCount}`;
      
      // Find assignee in line
      let assignee = 'Unassigned';
      for (const name of candidateNames) {
        if (line.includes(name)) {
          assignee = name;
          break;
        }
      }

      let priority: PriorityLevel = 'Medium';
      if (lineLower.includes('critical') || lineLower.includes('immediately') || lineLower.includes('urgent') || lineLower.includes('must')) {
        priority = 'High';
      }

      const cleanTitle = line.replace(/^[-*\d.]+\s*/, '').slice(0, 70);

      tasks.push({
        id: taskId,
        title: cleanTitle,
        description: line,
        assignee,
        priority,
        deadline: timeMatch ? timeMatch[0] : 'Unspecified',
        status: 'Pending',
        source: line,
        durationHours: 1.5
      });
    }

    // Detect Clarification / Gap
    if (line.includes('?') || lineLower.includes('unclear') || lineLower.includes('who is responsible') || lineLower.includes('not specified') || lineLower.includes('haven\'t specified')) {
      clarifications.push({
        id: `clarification-${clarifications.length + 1}`,
        question: line.replace(/^[-*\d.]+\s*/, ''),
        reason: 'Required information is ambiguous or missing in source text.',
        impact: 'HIGH',
        priority: clarifications.length + 1,
        status: 'OPEN'
      });

      risks.push({
        id: `risk-gap-${clarifications.length}`,
        riskType: 'AMBIGUITY',
        severity: 'HIGH',
        title: `Information Gap: ${line.slice(0, 40)}`,
        description: line,
        evidence: line,
        classification: 'EXPLICIT',
        resolved: false
      });
    }
  });

  // Generate dependencies between sequential tasks
  for (let i = 0; i < tasks.length - 1; i++) {
    dependencies.push({
      id: `dep-${i + 1}`,
      fromTaskId: tasks[i].id,
      toTaskId: tasks[i + 1].id,
      relationshipType: 'precedes',
      confidenceType: 'INFERRED',
      source: `Sequential execution path: ${tasks[i].title} precedes ${tasks[i + 1].title}`
    });
  }

  // Generate Action Steps
  const actionPlan: ActionStep[] = tasks.map((t, idx) => ({
    step: idx + 1,
    taskId: t.id,
    action: `${t.assignee !== 'Unassigned' ? t.assignee : 'Team'} executes: ${t.title}`,
    reason: `Priority: ${t.priority}. Deadline: ${t.deadline}.`,
    dependency: idx > 0 ? tasks[idx - 1].title : 'None'
  }));

  // Run Deterministic Audit
  const audit = runDeterministicAudit(tasks, dependencies, risks);

  return {
    summary: `Extracted ${tasks.length} tasks, ${deadlines.length} deadlines, and ${clarifications.length} gaps from custom project document.`,
    tasks: tasks.length > 0 ? tasks : [
      {
        id: 'task-1',
        title: 'Review custom project document requirements',
        description: text.slice(0, 150),
        assignee: candidateNames[0] || 'Unassigned',
        priority: 'High',
        deadline: 'Today',
        status: 'Pending',
        source: text.slice(0, 100),
        durationHours: 1.0
      }
    ],
    deadlines,
    decisions,
    entities,
    dependencies,
    risks,
    clarifications: clarifications.length > 0 ? clarifications : [
      {
        id: 'clarification-1',
        question: 'Who will take ownership of execution verification for this task list?',
        reason: 'Explicit owner missing for critical deliverables.',
        impact: 'HIGH',
        priority: 1,
        status: 'OPEN'
      }
    ],
    actionPlan,
    readinessScore: audit.readiness.finalScore,
    readinessStatus: audit.readiness.status,
    readinessBreakdown: audit.readiness,
    confidence: 88,
    confidenceReason: 'Heuristically extracted from user project text and validated via Execution Engine.',
    timestamp: new Date().toISOString(),
    isDemo: true
  };
}
