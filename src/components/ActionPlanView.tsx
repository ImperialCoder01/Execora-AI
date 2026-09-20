import React, { useState } from 'react';
import { ActionStep } from '../types';
import { CheckCircle2, ArrowRight, ShieldCheck, Clock, Layers, Sparkles, UserCheck, Zap } from 'lucide-react';

interface ActionPlanViewProps {
  actionPlan: ActionStep[];
  onOpenTodaysPlan: () => void;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({ actionPlan, onOpenTodaysPlan }) => {
  const [approvedSteps, setApprovedSteps] = useState<Record<number, boolean>>({});

  const toggleApproval = (stepNum: number) => {
    setApprovedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  const approvedCount = Object.values(approvedSteps).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-sky-800/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Execora Workflow Engine
              </span>
              <span className="text-xs text-slate-400">Human-In-The-Loop Control</span>
            </div>
            <h2 className="text-xl font-bold text-white">Prioritized Execution Plan</h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              AI-generated step-by-step resolution path ordered by task dependencies and deadline risk. Review each step and grant human approval before execution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-slate-400">Approved Steps</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {approvedCount} / {actionPlan.length}
              </div>
            </div>
            <button
              onClick={onOpenTodaysPlan}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-600/30 active:scale-95 whitespace-nowrap"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Compile Today's Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step Cards */}
      <div className="space-y-4">
        {actionPlan.map((step) => {
          const isApproved = !!approvedSteps[step.step];
          return (
            <div
              key={step.step}
              className={`border rounded-2xl p-5 transition-all shadow-lg ${
                isApproved
                  ? 'bg-emerald-950/20 border-emerald-800/80 shadow-emerald-950/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                
                {/* Step Number Badge & Details */}
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 font-mono ${
                      isApproved
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    }`}
                  >
                    {step.step}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-slate-100">
                        {step.action}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <strong className="text-sky-300">Strategic Rationale:</strong> {step.reason}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        <span>Dependency: <strong className="text-slate-300 font-mono">{step.dependency}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Human Approval Action Toggle */}
                <div className="flex flex-col items-end justify-center shrink-0 gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <button
                    onClick={() => toggleApproval(step.step)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                      isApproved
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200'
                    }`}
                  >
                    {isApproved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>Approved by Human</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 text-sky-400" />
                        <span>Grant Human Approval</span>
                      </>
                    )}
                  </button>

                  <span className="text-[10px] text-slate-500">
                    {isApproved ? 'Ready for automated execution' : 'Action requires explicit confirmation'}
                  </span>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
