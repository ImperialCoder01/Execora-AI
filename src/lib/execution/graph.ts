import { TaskItem, DependencyItem } from '../../types';

export type NodeType = 'PROJECT' | 'GOAL' | 'TASK' | 'PERSON' | 'DEADLINE' | 'DECISION' | 'REQUIREMENT' | 'DEPENDENCY' | 'BLOCKER' | 'RESOURCE';
export type EdgeType = 'DEPENDS_ON' | 'ASSIGNED_TO' | 'BLOCKS' | 'REQUIRES' | 'PRODUCES' | 'PRECEDES' | 'CONFLICTS_WITH' | 'DEADLINE_FOR' | 'SUPPORTS';

export interface GraphNode {
  id: string;
  type: NodeType;
  name: string;
  data: any;
}

export interface GraphEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: EdgeType;
  certainty: 'EXPLICIT' | 'INFERRED' | 'UNKNOWN';
}

export class ExecutionGraph {
  public nodes: Map<string, GraphNode> = new Map();
  public edges: GraphEdge[] = [];

  public addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
  }

  public addEdge(edge: GraphEdge): void {
    this.edges.push(edge);
  }

  public getDependencies(taskId: string): string[] {
    return this.edges
      .filter(e => e.targetNodeId === taskId && e.type === 'DEPENDS_ON')
      .map(e => e.sourceNodeId);
  }

  public getDependents(taskId: string): string[] {
    return this.edges
      .filter(e => e.sourceNodeId === taskId && e.type === 'DEPENDS_ON')
      .map(e => e.targetNodeId);
  }

  public detectCycles(): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (curr: string, path: string[]) => {
      visited.add(curr);
      recStack.add(curr);
      path.push(curr);

      const neighbors = this.getDependents(curr);
      for (const n of neighbors) {
        if (!visited.has(n)) {
          dfs(n, [...path]);
        } else if (recStack.has(n)) {
          const cycleStartIndex = path.indexOf(n);
          cycles.push(path.slice(cycleStartIndex));
        }
      }

      recStack.delete(curr);
    };

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        dfs(nodeId, []);
      }
    }

    return cycles;
  }

  public findCriticalPath(): string[] {
    // Topologically sorted longest dependency path
    const inDegree = new Map<string, number>();
    for (const id of this.nodes.keys()) {
      inDegree.set(id, 0);
    }

    this.edges.forEach(e => {
      if (e.type === 'DEPENDS_ON') {
        inDegree.set(e.targetNodeId, (inDegree.get(e.targetNodeId) || 0) + 1);
      }
    });

    const path: string[] = [];
    const queue: string[] = [];

    inDegree.forEach((degree, id) => {
      if (degree === 0) queue.push(id);
    });

    while (queue.length > 0) {
      const u = queue.shift()!;
      path.push(u);
      const dependents = this.getDependents(u);
      dependents.forEach(v => {
        inDegree.set(v, (inDegree.get(v) || 1) - 1);
        if (inDegree.get(v) === 0) {
          queue.push(v);
        }
      });
    }

    return path;
  }

  public findBlockedTasks(tasks: TaskItem[]): TaskItem[] {
    return tasks.filter(t => {
      const deps = this.getDependencies(t.id);
      return deps.some(depId => {
        const depTask = tasks.find(x => x.id === depId);
        return depTask && depTask.status !== 'Completed';
      });
    });
  }

  public findUnassignedTasks(tasks: TaskItem[]): TaskItem[] {
    return tasks.filter(t => !t.assignee || t.assignee.toLowerCase() === 'unassigned' || t.assignee.trim() === '');
  }

  public findResourceConflicts(tasks: TaskItem[]): Map<string, TaskItem[]> {
    const personMap = new Map<string, TaskItem[]>();
    tasks.forEach(t => {
      if (t.assignee && t.assignee.toLowerCase() !== 'unassigned') {
        const list = personMap.get(t.assignee) || [];
        list.push(t);
        personMap.set(t.assignee, list);
      }
    });

    const overloaded = new Map<string, TaskItem[]>();
    personMap.forEach((assignedTasks, person) => {
      if (assignedTasks.length >= 3) {
        overloaded.set(person, assignedTasks);
      }
    });

    return overloaded;
  }
}
