import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AnalysisResult } from '../types';
import { History, Calendar, CheckSquare, ArrowRight, Trash2, ShieldCheck } from 'lucide-react';

interface HistoryViewProps {
  onRestoreAnalysis: (analysis: AnalysisResult) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onRestoreAnalysis }) => {
  const { savedAnalyses, deleteAnalysisFromHistory } = useAuth();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <span>Document Extraction History & Records</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review past document analyses, restore previous workspace states, or manage saved records.
          </p>
        </div>

        <div className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-800/60">
          {savedAnalyses.length} Saved Records
        </div>
      </div>

      {/* History List */}
      {savedAnalyses.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs space-y-2">
          <History className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="font-semibold text-slate-400">No saved analysis history yet.</p>
          <p>Run a new analysis in the "Analyze & Extract" tab to save it here automatically.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedAnalyses.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent'}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {item.confidence}% Confidence
                  </span>
                  {item.isDemo && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      Demo Data
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {item.summary}
                </h4>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>{item.tasks.length} Tasks Extracted</span>
                  <span>•</span>
                  <span>{item.deadlines.length} Deadlines</span>
                  <span>•</span>
                  <span>{(item.missingInformation?.length ?? item.clarifications?.length ?? 0)} Gaps Flagged</span>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800 shrink-0">
                <button
                  onClick={() => onRestoreAnalysis(item)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 active:scale-95"
                >
                  <span>Restore Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {item.timestamp && (
                  <button
                    onClick={() => deleteAnalysisFromHistory(item.timestamp!)}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
