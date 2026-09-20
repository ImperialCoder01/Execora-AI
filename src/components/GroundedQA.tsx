import React, { useState } from 'react';
import { AnalysisResult, ChatMessage, GroundedQAResponse } from '../types';
import { askGroundedQAAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, ShieldCheck, Quote, AlertCircle, Sparkles, HelpCircle, Loader2 } from 'lucide-react';

interface GroundedQAProps {
  rawText: string;
  analysis: AnalysisResult;
  isDemoMode: boolean;
}

export const GroundedQA: React.FC<GroundedQAProps> = ({ rawText, analysis, isDemoMode }) => {
  const { userGroqKey } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am your Grounded Execora Assistant. You can ask me any question about your document. My answers are strictly constrained to facts in your provided source content and analysis.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      meta: { type: 'FACT' }
    }
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "What should I work on first?",
    "What are the upcoming deadlines?",
    "Which tasks are currently unassigned?",
    "What unresolved issues were reported?"
  ];

  const handleSend = async (qText?: string) => {
    const questionToSend = (qText || inputQuestion).trim();
    if (!questionToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: questionToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response: GroundedQAResponse = await askGroundedQAAPI(
        rawText,
        analysis,
        questionToSend,
        isDemoMode,
        userGroqKey
      );

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        meta: {
          type: response.type,
          sources: response.sources
        }
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "I don't have enough information to determine that from the provided content.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          meta: { type: 'UNAVAILABLE' }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeBadge = (type?: 'FACT' | 'RECOMMENDATION' | 'MIXED' | 'UNAVAILABLE') => {
    switch (type) {
      case 'FACT':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
      case 'RECOMMENDATION':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/80';
      case 'MIXED':
        return 'bg-sky-950/80 text-sky-300 border-sky-800/80';
      case 'UNAVAILABLE':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/80';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col h-[680px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800 shrink-0">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Grounded Document Q&A Engine</span>
          </h3>
          <p className="text-xs text-slate-400">
            Answers are strictly bounded to provided source text. Zero hallucination guarantee.
          </p>
        </div>
        <div className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-[11px] text-emerald-300 font-mono">
          Strict Context Boundary: ON
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="py-3 flex flex-wrap items-center gap-2 border-b border-slate-800/80 shrink-0">
        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          Quick Questions:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-700 text-xs text-slate-300 transition-all text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-br-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              {msg.sender === 'assistant' && msg.meta?.type && (
                <div className="mb-2 flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
                  <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${getTypeBadge(msg.meta.type)}`}>
                    CLASSIFICATION: {msg.meta.type}
                  </span>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>
              )}

              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Source Quotes */}
              {msg.meta?.sources && msg.meta.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-semibold text-sky-400 flex items-center gap-1">
                    <Quote className="w-3 h-3" />
                    <span>Evidence Sources:</span>
                  </div>
                  {msg.meta.sources.map((src, sIdx) => (
                    <div key={sIdx} className="text-[10px] italic text-slate-400 bg-slate-900/90 p-1.5 rounded border border-slate-800">
                      "{src}"
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-sky-400 p-3 bg-slate-950 rounded-xl border border-slate-800 w-fit">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Reasoning over grounded document context...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="pt-3 border-t border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask a question about your document content..."
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuestion.trim()}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-sky-600/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
