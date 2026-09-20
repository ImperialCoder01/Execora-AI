import React, { useState } from 'react';
import { AnalysisResult, ScenarioResult } from '../types';
import { runWhatIfSimulation, ScenarioType } from '../utils/scenarioSimulator';
import { PlayCircle, ShieldAlert, ArrowRight, UserX, Clock, AlertOctagon, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

interface WhatIfViewProps {
  analysis: AnalysisResult;
}

export const WhatIfView: React.FC<WhatIfViewProps> = ({ analysis }) => {
  const [activeScenario, setActiveScenario] = useState<ScenarioResult | null>(
    analysis.scenarios && analysis.scenarios.length > 0 ? analysis.scenarios[0] : null
  );

  const handleSimulate = (type: ScenarioType, personName?: string, delayHours?: number, taskId?: string) => {
    const result = runWhatIfSimulation(analysis, { type, personName, delayHours, taskId });
    setActiveScenario(result);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-purple-400" />
            <span>What-If Scenario Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate delays, resource unavailability, and unplanned blockers to test plan resilience.
          </p>
        </div>
      </div>

      {/* Preset Scenario Simulator Buttons */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Select Scenario to Simulate:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Scenario 1: Rahul Delayed */}
          <button
            onClick={() => handleSimulate('TASK_DELAY', 'Rahul', 1, 'task-1')}
            className="p-3.5 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-700 text-left transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-200 group-hover:text-purple-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Rahul Delayed by 1 Hour
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Simulates delay in API bug fixing before 3:30 PM cutoff.
            </p>
          </button>

          {/* Scenario 2: Person Unavailable */}
          <button
            onClick={() => handleSimulate('PERSON_UNAVAILABLE', 'Sahil')}
            className="p-3.5 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-700 text-left transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-200 group-hover:text-rose-300 flex items-center gap-1.5">
                <UserX className="w-3.5 h-3.5 text-rose-400" />
                Sahil Unavailable
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Simulates unexpected emergency absence of Sahil.
            </p>
          </button>

          {/* Scenario 3: Unplanned Security Blocker */}
          <button
            onClick={() => handleSimulate('BLOCKER_ADDED')}
            className="p-3.5 rounded-xl bg-slate-950 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-700 text-left transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-200 group-hover:text-amber-300 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                Security Audit Blocker Added
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Simulates unplanned mandatory security review before deployment.
            </p>
          </button>
        </div>
      </div>

      {/* Active Scenario Simulation Results */}
      {activeScenario && (
        <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-800/80 rounded-2xl p-6 shadow-2xl space-y-5 animate-fadeIn">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-900/60 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700">
                  SIMULATION RESULT
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{activeScenario.name}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{activeScenario.description}</p>
            </div>

            {/* Score Comparison Pill */}
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-purple-800">
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Baseline vs Simulated</div>
                <div className="text-sm font-bold text-white font-mono flex items-center gap-1">
                  <span className="text-slate-400">{analysis.readinessScore}%</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                  <span className={activeScenario.readinessScore < 60 ? 'text-rose-400' : 'text-amber-400'}>
                    {activeScenario.readinessScore}%
                  </span>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  activeScenario.readinessStatus === 'BLOCKED'
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}
              >
                {activeScenario.readinessStatus}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Affected Tasks */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Affected Downstream Tasks ({activeScenario.affectedTasks.length})</span>
              </h4>
              <ul className="space-y-1 text-slate-300">
                {activeScenario.affectedTasks.map((t, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded border border-slate-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Affected People & Path Status */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Resource Impact & Critical Path</span>
              </h4>
              <div className="space-y-2 text-slate-300">
                <div>
                  <span className="text-slate-400">Impacted Personnel: </span>
                  <strong className="text-white font-mono">{activeScenario.affectedPeople.join(', ')}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Critical Path Changed: </span>
                  <strong className="text-purple-300 font-mono">YES (Delay Propagated)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommended Mitigation */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-800 text-xs space-y-1">
            <div className="font-bold text-purple-300 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Strategic Mitigation:</span>
            </div>
            <p className="text-slate-200 leading-relaxed">
              {activeScenario.recommendation}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};
