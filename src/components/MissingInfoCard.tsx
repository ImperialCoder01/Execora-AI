import React from 'react';
import { MissingInformationItem } from '../types';
import { AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';

interface MissingInfoCardProps {
  missingInfo: MissingInformationItem[];
}

export const MissingInfoCard: React.FC<MissingInfoCardProps> = ({ missingInfo }) => {
  if (!missingInfo || missingInfo.length === 0) {
    return (
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>Information Gaps & Ambiguities</span>
        </h3>
        <p className="text-xs text-slate-400">No critical missing information detected in provided text.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-amber-900/50 p-5 shadow-xl">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Detected Information Gaps ({missingInfo.length})</span>
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-mono">
          Action Required
        </span>
      </div>

      <div className="space-y-2.5">
        {missingInfo.map((gap, idx) => (
          <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-amber-950/80 text-xs">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              <span>{gap.item}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pl-3 border-l border-amber-900/40">
              {gap.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
