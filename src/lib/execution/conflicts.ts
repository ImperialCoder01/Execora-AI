import { TaskItem, DependencyItem } from '../../types';

export interface ExecutionConflict {
  type: 'OWNER_MISSING' | 'RESOURCE_OVERLOAD' | 'DEADLINE_AMBIGUITY' | 'DEPENDENCY_CYCLE';
  title: string;
  description: string;
  affectedTaskIds: string[];
}

export function detectExecutionConflicts(tasks: TaskItem[], dependencies: DependencyItem[]): ExecutionConflict[] {
  const conflicts: ExecutionConflict[] = [];

  // Missing owners
  const unassigned = tasks.filter(t => !t.assignee || t.assignee.toLowerCase() === 'unassigned');
  if (unassigned.length > 0) {
    conflicts.push({
      type: 'OWNER_MISSING',
      title: 'Unassigned Critical Execution Tasks',
      description: `${unassigned.length} task(s) do not have an assigned owner.`,
      affectedTaskIds: unassigned.map(t => t.id)
    });
  }

  // Workload concentration
  const assigneeMap = new Map<string, TaskItem[]>();
  tasks.forEach(t => {
    if (t.assignee && t.assignee.toLowerCase() !== 'unassigned') {
      const list = assigneeMap.get(t.assignee) || [];
      list.push(t);
      assigneeMap.set(t.assignee, list);
    }
  });

  assigneeMap.forEach((assignedTasks, person) => {
    if (assignedTasks.length >= 3) {
      conflicts.push({
        type: 'RESOURCE_OVERLOAD',
        title: `Workload Bottleneck: ${person}`,
        description: `${person} is assigned to ${assignedTasks.length} tasks in the execution sequence.`,
        affectedTaskIds: assignedTasks.map(t => t.id)
      });
    }
  });

  return conflicts;
}
