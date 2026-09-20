import { TaskItem, DependencyItem } from '../../types';

export function computeDependencyCriticalPath(tasks: TaskItem[], dependencies: DependencyItem[]): TaskItem[] {
  // Build topological dependency chain
  const taskMap = new Map<string, TaskItem>(tasks.map(t => [t.id, t]));
  const inDegrees = new Map<string, number>();
  
  tasks.forEach(t => inDegrees.set(t.id, 0));
  dependencies.forEach(d => {
    inDegrees.set(d.toTaskId, (inDegrees.get(d.toTaskId) || 0) + 1);
  });

  const queue: string[] = [];
  inDegrees.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const criticalSequence: TaskItem[] = [];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const task = taskMap.get(currentId);
    if (task) criticalSequence.push(task);

    dependencies.filter(d => d.fromTaskId === currentId).forEach(d => {
      inDegrees.set(d.toTaskId, (inDegrees.get(d.toTaskId) || 1) - 1);
      if (inDegrees.get(d.toTaskId) === 0) {
        queue.push(d.toTaskId);
      }
    });
  }

  return criticalSequence;
}
