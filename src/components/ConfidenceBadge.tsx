import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, HelpCircle, Info } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence: number;
  reason: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence, reason }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  let colorClass = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80';
  let badgeText = 'High Confidence';
  let Icon = ShieldCheck;

  if (confidence < 75 && confidence >= 50) {
    colorClass = 'bg-amber-950/80 text-amber-400 border-amber-800/80';
    badgeText = 'Moderate Confidence';
    Icon = AlertTriangle;
  } else if (confidence < 50) {
    colorClass = 'bg-rose-950/80 text-rose-400 border-rose-800/80';
    badgeText = 'Low Confidence';
    Icon = HelpCircle;
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all shadow-sm ${colorClass}`}
      >
        <Icon className="w-4 h-4" />
        <span>{confidence}% AI Confidence</span>
        <span className="text-[10px] opacity-75 font-normal">({badgeText})</span>
        <Info className="w-3.5 h-3.5 opacity-60 ml-0.5" />
      </div>

      {showTooltip && (
        <div className="absolute right-0 mt-2 w-72 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 text-xs text-slate-300">
          <div className="font-semibold text-white mb-1 flex items-center justify-between">
            <span>Confidence Assessment</span>
            <span className="font-mono text-indigo-400">{confidence}/100</span>
          </div>
          <p className="leading-relaxed text-slate-300">{reason}</p>
          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-500">
            Calculated based on explicit task ownership, date clarity, and ambiguity metrics.
          </div>
        </div>
      )}
    </div>
  );
};
