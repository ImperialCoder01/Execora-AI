import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { X, Copy, Check, Sparkles, Calendar, CheckSquare, Download, Zap } from 'lucide-react';

interface TodaysPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult;
}

export const TodaysPlanModal: React.FC<TodaysPlanModalProps> = ({ isOpen, onClose, analysis }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const highPriorityTasks = analysis.tasks.filter(t => t.priority === 'High');
  const upcomingDeadlines = analysis.deadlines;

  const planText = `🎯 EXECORA TODAY'S EXECUTION PLAN
Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

HIGH PRIORITY TASKS:
${highPriorityTasks.map(t => `- [ ] ${t.title} (Assignee: ${t.assignee}, Due: ${t.deadline})`).join('\n')}

UPCOMING DEADLINES:
${upcomingDeadlines.map(d => `- ⏰ ${d.event}: ${d.date} ${d.time}`).join('\n')}

ACTION STEPS:
${analysis.actionPlan.map(a => `${a.step}. ${a.action} (Reason: ${a.reason})`).join('\n')}

INFORMATION GAPS TO RESOLVE:
${(analysis.clarifications || []).map(c => `- ⚠️ Question: ${c.question} (Reason: ${c.reason})`).join('\n')}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(planText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `execora_plan_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sky-600/20 border border-sky-500/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-sky-400 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Today's Prioritized Plan</h3>
              <p className="text-xs text-slate-400">Execora synthesized agenda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* High Priority Tasks */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <CheckSquare className="w-4 h-4 text-rose-400" />
              <span>High Priority Items ({highPriorityTasks.length})</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              {highPriorityTasks.map((t, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded border border-slate-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5"></span>
                  <div>
                    <span className="font-semibold text-slate-100">{t.title}</span>
                    <span className="text-slate-400 text-[11px] block">Assignee: {t.assignee} | Due: {t.deadline}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Steps */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4 text-sky-400 fill-current" />
              <span>Sequential Action Steps</span>
            </h4>
            <div className="space-y-2">
              {analysis.actionPlan.map((step) => (
                <div key={step.step} className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded bg-sky-900 text-sky-200 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                    {step.step}
                  </span>
                  <div>
                    <p className="font-medium text-slate-200">{step.action}</p>
                    <p className="text-[11px] text-slate-400">{step.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md shadow-sky-600/30 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
