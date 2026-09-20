import React, { useState } from 'react';
import { ClarificationItem, AnalysisResult } from '../types';
import { HelpCircle, Sparkles, Send, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';

interface ClarificationViewProps {
  clarifications: ClarificationItem[];
  onAnswerClarification: (clarificationId: string, answer: string) => void;
  previousScore?: number;
  scoreChangeReason?: string;
  currentScore: number;
}

export const ClarificationView: React.FC<ClarificationViewProps> = ({
  clarifications,
  onAnswerClarification,
  previousScore,
  scoreChangeReason,
  currentScore,
}) => {
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({});

  const handleInputChange = (id: string, text: string) => {
    setAnswerInputs(prev => ({ ...prev, [id]: text }));
  };

  const handleQuickAnswer = (id: string, presetAnswer: string) => {
    onAnswerClarification(id, presetAnswer);
  };

  const handleSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const answer = answerInputs[id]?.trim();
    if (!answer) return;
    onAnswerClarification(id, answer);
    setAnswerInputs(prev => ({ ...prev, [id]: '' }));
  };

  const openCount = clarifications.filter(c => c.status === 'OPEN').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-400" />
            <span>Interactive Clarification Loop</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Answer high-impact questions to resolve blockers and immediately trigger dynamic readiness recalculation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-800 font-bold">
            {openCount} Open Question(s)
          </span>
        </div>
      </div>

      {/* Score Recalculation Alert */}
      {previousScore !== undefined && scoreChangeReason && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-800/80 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                <span>READINESS SCORE RECALCULATED</span>
                <span className="font-mono text-white bg-slate-950 px-2 py-0.5 rounded border border-emerald-900">
                  {previousScore}% → {currentScore}%
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{scoreChangeReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Clarification Cards */}
      <div className="space-y-4">
        {clarifications.map((item) => {
          const isOpen = item.status === 'OPEN';
          return (
            <div
              key={item.id}
              className={`border rounded-2xl p-5 shadow-lg transition-all ${
                isOpen
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  : 'bg-emerald-950/20 border-emerald-800/80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
                      IMPACT: {item.impact}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Priority #{item.priority}</span>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      isOpen
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white">
                  {item.question}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-sky-300">Why this matters:</strong> {item.reason}
                </p>

                {isOpen ? (
                  <div className="space-y-3 pt-2">
                    {/* Preset Answers */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-semibold">Quick Answers:</span>
                      <button
                        onClick={() => handleQuickAnswer(item.id, "Sahil will produce the demo video and take presentation screenshots.")}
                        className="px-2.5 py-1 rounded-lg bg-sky-950 hover:bg-sky-900 border border-sky-800 text-xs text-sky-200 transition-all"
                      >
                        "Sahil owns demo video & screenshots"
                      </button>
                      <button
                        onClick={() => handleQuickAnswer(item.id, "Vishal will handle deployment and testing.")}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-all"
                      >
                        "Vishal handles deployment"
                      </button>
                    </div>

                    {/* Form Input */}
                    <form onSubmit={(e) => handleSubmit(e, item.id)} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={answerInputs[item.id] || ''}
                        onChange={(e) => handleInputChange(item.id, e.target.value)}
                        placeholder="Type clarification answer to recalculate readiness..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-sky-600/30"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Answer</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/80 text-xs text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Resolved Answer:</strong> "{item.answer}"</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
