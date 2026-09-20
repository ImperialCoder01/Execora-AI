import React, { useState } from 'react';
import { TaskItem, DependencyItem, EntityItem } from '../types';
import { Layers, User, ArrowRight, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

interface ExecutionGraphViewProps {
  tasks: TaskItem[];
  dependencies: DependencyItem[];
  entities: EntityItem[];
}

export const ExecutionGraphView: React.FC<ExecutionGraphViewProps> = ({
  tasks,
  dependencies,
  entities,
}) => {
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const getRelationshipBadge = (rel: string) => {
    switch (rel) {
      case 'depends_on':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'blocks':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      case 'requires':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-800';
      case 'precedes':
        return 'bg-sky-950/80 text-sky-300 border-sky-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getClassificationBadge = (cType: string) => {
    switch (cType) {
      case 'EXPLICIT':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'INFERRED':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <span>Structured Execution Dependency Graph</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual map of tasks, assignees, resource constraints, and downstream blockers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono">
            {tasks.length} Nodes
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono">
            {dependencies.length} Edges
          </span>
        </div>
      </div>

      {/* Visual Execution Sequence Map */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <span>Execution Sequence & Dependencies</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task, idx) => {
            const incomingDeps = dependencies.filter(d => d.toTaskId === task.id);
            const outgoingDeps = dependencies.filter(d => d.fromTaskId === task.id);
            const isUnassigned = task.assignee === 'Unassigned';

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-md flex flex-col justify-between ${
                  selectedTask?.id === task.id
                    ? 'bg-sky-950/60 border-sky-500 text-white ring-2 ring-sky-500/30'
                    : isUnassigned
                    ? 'bg-rose-950/20 border-rose-900/80 hover:border-rose-700'
                    : 'bg-slate-950/80 hover:bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      Step {idx + 1} ({task.id})
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        task.priority === 'High' ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mb-1 leading-snug">
                    {task.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {task.description || task.source}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      Assignee:
                    </span>
                    <strong className={`font-mono ${isUnassigned ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                      {task.assignee}
                    </strong>
                  </div>

                  {outgoingDeps.length > 0 && (
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                      <ArrowRight className="w-3 h-3 text-sky-400" />
                      <span>Blocks {outgoingDeps.length} downstream task(s)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dependency Edge Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-3">
          <span>Extracted Relationship Edges ({dependencies.length})</span>
        </h3>

        <div className="space-y-2.5">
          {dependencies.map((dep) => {
            const fromTask = tasks.find(t => t.id === dep.fromTaskId);
            const toTask = tasks.find(t => t.id === dep.toTaskId);

            return (
              <div key={dep.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  <span className="font-semibold text-slate-200">{fromTask?.title || dep.fromTaskId}</span>
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${getRelationshipBadge(dep.relationshipType)}`}>
                    {dep.relationshipType}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold text-slate-200">{toTask?.title || dep.toTaskId}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getClassificationBadge(dep.confidenceType)}`}>
                    {dep.confidenceType}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
