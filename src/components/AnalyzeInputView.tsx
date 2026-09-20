import React, { useState } from 'react';
import { SampleSelector } from './SampleSelector';
import { SamplePreset } from '../data/sampleInputs';
import { parseDocumentAPI } from '../services/api';
import { Sparkles, FileText, Upload, RefreshCw, AlertCircle, ArrowRight, Loader2, Zap, CheckCircle2, FileType } from 'lucide-react';

interface AnalyzeInputViewProps {
  rawText: string;
  onTextChange: (text: string) => void;
  onAnalyze: (forceDemo?: boolean) => void;
  isLoading: boolean;
  onSelectPreset: (preset: SamplePreset) => void;
  selectedPresetId?: string;
}

export const AnalyzeInputView: React.FC<AnalyzeInputViewProps> = ({
  rawText,
  onTextChange,
  onAnalyze,
  isLoading,
  onSelectPreset,
  selectedPresetId,
}) => {
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileSuccess, setFileSuccess] = useState<string | null>(null);
  const [isParsingDoc, setIsParsingDoc] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    setFileSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingDoc(true);

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const fileBase64 = event.target?.result as string;
        
        // Attempt backend document parsing for PDF, DOCX, etc.
        const parsed = await parseDocumentAPI(fileBase64, file.name, file.type);
        
        if (parsed.text) {
          onTextChange(parsed.text);
          setFileSuccess(`Extracted ${parsed.wordCount.toLocaleString()} words from "${parsed.fileName}" (${parsed.type})`);
        } else {
          setFileError(`Could not extract readable text from "${file.name}".`);
        }
      } catch (err: any) {
        // Fallback for plain text, markdown, csv, json, log files client-side
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (['txt', 'md', 'csv', 'json', 'log', 'html', 'xml', 'yml', 'yaml', 'rtf', 'js', 'ts', 'py'].includes(ext || '')) {
          const textReader = new FileReader();
          textReader.onload = (txtEvent) => {
            const raw = txtEvent.target?.result as string;
            if (raw) {
              onTextChange(raw);
              const count = raw.split(/\s+/).filter(Boolean).length;
              setFileSuccess(`Loaded ${count.toLocaleString()} words from "${file.name}"`);
            }
          };
          textReader.readAsText(file);
        } else {
          setFileError(`Failed to parse "${file.name}": ${err.message || 'Unknown error'}`);
        }
      } finally {
        setIsParsingDoc(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-400" />
          <span>Ingest & Extract Unstructured Information</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Paste meeting transcriptions, PRD notes, team emails, or upload any document file (PDF, Word DOCX, TXT, CSV, JSON, LOG). Execora AI will extract tasks, deadlines, decisions, assignees, and missing information using structured reasoning.
        </p>
      </div>

      {/* Preset Selector */}
      <SampleSelector onSelectSample={onSelectPreset} activeId={selectedPresetId} />

      {/* Text Input Card */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Unstructured Source Content:</span>
          </label>

          {/* Universal File Upload Button */}
          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-3.5 py-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 text-xs text-sky-200 font-semibold transition-all flex items-center gap-2 shadow-sm active:scale-95">
              {isParsingDoc ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                  <span>Parsing Document...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  <span>Upload Document (.pdf, .docx, .txt, .csv...)</span>
                </>
              )}
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md,.csv,.json,.log,.rtf,.html,.xml,.yml,.yaml"
                onChange={handleFileUpload}
                disabled={isParsingDoc}
                className="hidden"
              />
            </label>

            <button
              onClick={() => {
                onTextChange('');
                setFileSuccess(null);
                setFileError(null);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Notifications */}
        {fileSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{fileSuccess}</span>
            </div>
            <button onClick={() => setFileSuccess(null)} className="text-emerald-400 hover:text-emerald-200">
              Dismiss
            </button>
          </div>
        )}

        {fileError && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{fileError}</span>
            </div>
            <button onClick={() => setFileError(null)} className="text-rose-400 hover:text-rose-200">
              Dismiss
            </button>
          </div>
        )}

        {/* Text Area */}
        <textarea
          rows={12}
          value={rawText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Paste meeting transcriptions, email threads, task descriptions, or project requirements here... Or click 'Upload Document' above to upload any PDF, Word (.docx), TXT, CSV, or JSON file."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 leading-relaxed shadow-inner"
        ></textarea>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-slate-500 font-mono">
            {rawText.length} characters | {rawText.split(/\s+/).filter(Boolean).length} words
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onAnalyze(true)}
              disabled={isLoading || isParsingDoc || !rawText.trim()}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-all active:scale-95 disabled:opacity-50"
            >
              Run Demo Analysis
            </button>

            <button
              onClick={() => onAnalyze(false)}
              disabled={isLoading || isParsingDoc || !rawText.trim()}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-500 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing with Groq...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Extract Work & Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
