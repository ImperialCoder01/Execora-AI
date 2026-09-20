import React, { useState } from 'react';
import { TaskItem, PriorityLevel, TaskStatus } from '../types';
import { User, Calendar, AlertCircle, Quote, CheckCircle2, Clock, PlayCircle, Filter } from 'lucide-react';

interface TaskListProps {
  tasks: TaskItem[];
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskStatusChange }) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);

  const filteredTasks = tasks.filter((task) => {
    if (filterPriority === 'ALL') return true;
    if (filterPriority === 'HIGH') return task.priority === 'High';
    if (filterPriority === 'UNASSIGNED') return task.assignee === 'Unassigned';
    return true;
  });

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/80';
      case 'Medium':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/80';
      case 'Low':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/80';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
      case 'In Progress':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80';
      case 'Pending':
        return 'bg-slate-900 text-slate-300 border-slate-700';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-xl">
      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            <span>Extracted Work Items & Tasks ({tasks.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Click status pill to update progress or expand source quote for grounding verification.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-1" />
          <button
            onClick={() => setFilterPriority('ALL')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterPriority === 'ALL' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilterPriority('HIGH')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterPriority === 'HIGH' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High Priority ({tasks.filter(t => t.priority === 'High').length})
          </button>
          <button
            onClick={() => setFilterPriority('UNASSIGNED')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterPriority === 'UNASSIGNED' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Unassigned ({tasks.filter(t => t.assignee === 'Unassigned').length})
          </button>
        </div>
      </div>

      {/* Task Cards */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
          No tasks found matching filter criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 transition-all shadow-sm group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${getPriorityBadge(task.priority)}`}>
                      {task.priority} Priority
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(task.status)}`}>
                      {task.status}
                    </span>
                    {task.assignee === 'Unassigned' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-400 border border-rose-800/80 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Unassigned Gap
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {task.title}
                  </h4>
                </div>

                {/* Status Toggle Selector */}
                {onTaskStatusChange && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTaskStatusChange(task.id, 'Pending')}
                      className={`px-2 py-1 text-[11px] rounded border ${
                        task.status === 'Pending' ? 'bg-slate-800 border-slate-600 text-white font-semibold' : 'border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => onTaskStatusChange(task.id, 'In Progress')}
                      className={`px-2 py-1 text-[11px] rounded border ${
                        task.status === 'In Progress' ? 'bg-indigo-900 border-indigo-700 text-indigo-200 font-semibold' : 'border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => onTaskStatusChange(task.id, 'Completed')}
                      className={`px-2 py-1 text-[11px] rounded border ${
                        task.status === 'Completed' ? 'bg-emerald-900 border-emerald-700 text-emerald-200 font-semibold' : 'border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Task Meta Details */}
              <div className="mt-3 pt-2.5 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Assignee: <strong className={task.assignee === 'Unassigned' ? 'text-rose-400' : 'text-slate-200'}>{task.assignee}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Deadline: <strong className="text-slate-200">{task.deadline}</strong></span>
                  </div>
                </div>

                {/* Source Citation Button */}
                <button
                  onClick={() => setExpandedSourceId(expandedSourceId === task.id ? null : task.id)}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  <Quote className="w-3 h-3" />
                  <span>{expandedSourceId === task.id ? 'Hide Evidence' : 'View Source Evidence'}</span>
                </button>
              </div>

              {/* Source Evidence Expandable Box */}
              {expandedSourceId === task.id && (
                <div className="mt-2.5 p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/50 text-xs text-indigo-200 animate-fadeIn">
                  <div className="font-semibold text-indigo-300 mb-1 flex items-center gap-1">
                    <Quote className="w-3.5 h-3.5" />
                    <span>Original Document Evidence:</span>
                  </div>
                  <p className="italic bg-slate-950/60 p-2 rounded border border-indigo-900/60 font-mono text-[11px] text-slate-300">
                    "{task.source}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
