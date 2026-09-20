import React, { useState } from 'react';
import { AnalysisResult, TaskStatus } from '../types';
import { TaskList } from './TaskList';
import { MissingInfoCard } from './MissingInfoCard';
import { 
  CheckSquare, 
  Calendar, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  ShieldAlert, 
  PlayCircle, 
  Info, 
  Zap, 
  AlertTriangle, 
  TrendingUp,
  FileCheck,
  UserCheck
} from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onNavigateTab: (tab: 'dashboard' | 'analyze' | 'actionPlan' | 'groundedQA' | 'history' | 'admin' | 'graph' | 'audit' | 'clarification' | 'whatif') => void;
  onOpenTodaysPlan: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysis,
  onTaskStatusChange,
  onNavigateTab,
  onOpenTodaysPlan,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const pendingTasksCount = analysis.tasks.filter(t => t.status === 'Pending').length;
  const highPriorityCount = analysis.tasks.filter(t => t.priority === 'High').length;
  const criticalRisksCount = analysis.risks.filter(r => r.severity === 'CRITICAL').length;
  const openClarificationsCount = analysis.clarifications.filter(c => c.status === 'OPEN').length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'READY':
        return {
          bg: 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-emerald-700/80',
          badge: 'bg-emerald-950 text-emerald-300 border-emerald-700',
          ring: 'ring-emerald-500/30'
        };
      case 'READY WITH WARNINGS':
        return {
          bg: 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-amber-700/80',
          badge: 'bg-amber-950 text-amber-300 border-amber-700',
          ring: 'ring-amber-500/30'
        };
      case 'BLOCKED':
        return {
          bg: 'bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border-rose-700/80',
          badge: 'bg-rose-950 text-rose-300 border-rose-700',
          ring: 'ring-rose-500/30'
        };
      default:
        return {
          bg: 'bg-slate-900 border-slate-800',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          ring: 'ring-slate-500/30'
        };
    }
  };

  const statusTheme = getStatusStyle(analysis.readinessStatus);

  return (
    <div className="space-y-6">
      
      {/* 🏆 PRIMARY READINESS ENGINE BANNER */}
      <div className={`border rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all ${statusTheme.bg}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Readiness Score Gauge & Explanation */}
          <div className="flex items-center gap-6">
            <div 
              className="relative cursor-pointer group shrink-0" 
              onClick={() => setShowBreakdown(!showBreakdown)}
              title="Click to view transparent score breakdown"
            >
              <div className="h-24 w-24 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col items-center justify-center shadow-2xl relative group-hover:scale-105 transition-transform">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
                  {analysis.readinessScore}%
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mt-0.5">
                  Readiness
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${statusTheme.badge}`}>
                  {analysis.readinessStatus}
                </span>
                {analysis.previousScore !== undefined && (
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-950/90 px-2.5 py-0.5 rounded-full border border-emerald-900 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Score improved from {analysis.previousScore}%
                  </span>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-white leading-snug">
                Execution Readiness Assessment
              </h2>
              
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {analysis.readinessStatus === 'BLOCKED'
                  ? 'Critical risks or missing task owners block execution. Resolve open clarification questions to recalculate readiness.'
                  : 'Execora checked your project graph: tasks are connected and executable with manageable warnings.'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('clarification')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-700 text-amber-200 font-bold text-xs transition-all shadow-md active:scale-95"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Resolve {openClarificationsCount} Questions</span>
            </button>

            <button
              onClick={() => onNavigateTab('whatif')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700 text-purple-200 font-bold text-xs transition-all shadow-md active:scale-95"
            >
              <PlayCircle className="w-4 h-4 text-purple-400" />
              <span>Simulate What-If</span>
            </button>

            <button
              onClick={onOpenTodaysPlan}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all shadow-lg shadow-sky-600/30 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Export Today's Plan</span>
            </button>
          </div>

        </div>

        {/* Expandable Score Penalties Breakdown */}
        {showBreakdown && analysis.readinessBreakdown && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 bg-slate-950/80 p-4 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-slate-200 flex items-center justify-between mb-2">
              <span>Readiness Calculation Formula</span>
              <span className="text-[10px] text-slate-400 font-mono">Baseline: 100 Points</span>
            </div>
            {analysis.readinessBreakdown.penalties.length > 0 ? (
              analysis.readinessBreakdown.penalties.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-rose-950 text-rose-300">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{p.reason}</span>
                  </span>
                  <span className="font-mono font-bold text-rose-400">-{p.points} pts</span>
                </div>
              ))
            ) : (
              <div className="text-emerald-400 font-medium">✅ Zero execution penalties detected! Graph is 100% ready.</div>
            )}
          </div>
        )}
      </div>

      {/* 📊 4 TOP METRIC STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Extracted Tasks */}
        <div 
          onClick={() => onNavigateTab('actionPlan')}
          className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-sky-800/60 p-5 rounded-2xl transition-all cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Tasks</span>
            <CheckSquare className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{analysis.tasks.length}</span>
            <span className="text-xs font-bold text-sky-400">{highPriorityCount} High Priority</span>
          </div>
        </div>

        {/* Card 2: Dependencies */}
        <div 
          onClick={() => onNavigateTab('graph')}
          className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-800/60 p-5 rounded-2xl transition-all cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Graph Dependencies</span>
            <Layers className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{analysis.dependencies.length}</span>
            <span className="text-xs font-semibold text-slate-400">Mapped Edges</span>
          </div>
        </div>

        {/* Card 3: Execution Risks */}
        <div 
          onClick={() => onNavigateTab('audit')}
          className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-rose-800/60 p-5 rounded-2xl transition-all cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Execution Risks</span>
            <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{analysis.risks.length}</span>
            <span className="text-xs font-bold text-rose-400">{criticalRisksCount} Critical</span>
          </div>
        </div>

        {/* Card 4: Grounding Confidence */}
        <div 
          onClick={() => onNavigateTab('groundedQA')}
          className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-800/60 p-5 rounded-2xl transition-all cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Grounding</span>
            <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">
              {Math.round((analysis.confidence || 0.85) * 100)}%
            </span>
            <span className="text-xs font-bold text-emerald-400">High Confidence</span>
          </div>
        </div>

      </div>

      {/* 🧩 MAIN DASHBOARD GRID (TASKS & SIDEBAR ITEMS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Task Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-xl">
            <TaskList tasks={analysis.tasks} onTaskStatusChange={onTaskStatusChange} />
          </div>
        </div>

        {/* Right Column (1 Col): Deadlines & Decisions */}
        <div className="space-y-6">
          
          {/* Information Gaps Card */}
          <MissingInfoCard missingInfo={analysis.clarifications?.map(c => ({ item: c.question, reason: c.reason, impact: c.impact })) || []} />

          {/* Upcoming Deadlines Timeline Card */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>Extracted Deadlines ({analysis.deadlines.length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {analysis.deadlines.map((dl, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-200">{dl.event}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Date: {dl.date}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 font-mono font-bold text-xs border border-amber-800">
                    {dl.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Decisions Agreed Card */}
          {analysis.decisions.length > 0 && (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                <span>Key Agreed Decisions ({analysis.decisions.length})</span>
              </h3>
              {analysis.decisions.map((dec, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-indigo-950 text-xs space-y-1">
                  <p className="text-slate-200 font-semibold italic">"{dec.decision}"</p>
                  <p className="text-[10px] text-slate-400 truncate">Source: {dec.source}</p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
