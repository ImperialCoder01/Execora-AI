import React from 'react';
import { SAMPLE_PRESETS, SamplePreset } from '../data/sampleInputs';
import { FileText, Sparkles } from 'lucide-react';

interface SampleSelectorProps {
  onSelectSample: (preset: SamplePreset) => void;
  activeId?: string;
}

export const SampleSelector: React.FC<SampleSelectorProps> = ({ onSelectSample, activeId }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Try Demo Presets (1-Click Analysis):</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {SAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectSample(preset)}
            className={`text-left p-3 rounded-xl border text-xs transition-all flex flex-col justify-between ${
              activeId === preset.id
                ? 'bg-indigo-950/60 border-indigo-500/80 text-white shadow-lg shadow-indigo-500/10'
                : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-semibold text-slate-100 truncate">{preset.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  {preset.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {preset.text}
              </p>
            </div>
            <div className="mt-2 text-[10px] text-indigo-400 font-medium flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>Click to populate & analyze</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
