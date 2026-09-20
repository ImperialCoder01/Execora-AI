import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { Key, Settings, ShieldCheck, Database, X, Check, Save, Eye, EyeOff } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { userGroqKey, setUserGroqKey, user, role } = useAuth();
  const [apiKeyInput, setApiKeyInput] = useState(userGroqKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserGroqKey(apiKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 relative">
        
        {/* Close Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <Settings className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Application & AI Settings</h3>
              <p className="text-xs text-slate-400">Configure credentials & preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Card */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Signed In Account:</span>
            <div className="font-bold text-white mt-0.5">{user?.email || 'Anonymous Session'}</div>
          </div>
          <span
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase border ${
              role === 'admin'
                ? 'bg-purple-950 text-purple-300 border-purple-800'
                : 'bg-indigo-950 text-indigo-300 border-indigo-800'
            }`}
          >
            ROLE: {role}
          </span>
        </div>

        {/* Groq API Key Configuration Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-200 font-semibold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Custom Groq API Key (`GROQ_API_KEY`)
              </span>
              <a
                href="https://console.groq.com/"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline font-normal text-[11px]"
              >
                Get Groq Key
              </a>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="gsk_..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-slate-100 font-mono text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Your key is saved in your browser session and sent to the server proxy for Live Groq LLM inference.
            </p>
          </div>

          {/* Database Connection Indicator */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                Supabase Auth & PostgreSQL:
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isSupabaseConfigured
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isSupabaseConfigured ? 'CONNECTED' : 'STANDALONE MODE'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {isSupabaseConfigured
                ? 'Connected to Supabase PostgreSQL database.'
                : 'Operating in Standalone Mode using Local Storage persistence. Configure VITE_SUPABASE_URL in .env to connect Supabase Cloud.'}
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
