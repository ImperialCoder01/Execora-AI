import React, { useState } from 'react';
import { Settings, LogOut, PlayCircle, Key, Zap, User, Sparkles } from 'lucide-react';
import { HealthStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TabType } from './Navigation';

interface HeaderProps {
  health: HealthStatus;
  isDemoMode: boolean;
  activeTab: TabType;
  onToggleDemoMode: () => void;
  onLoadDemoData: () => void;
  onOpenTodaysPlan: () => void;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  isSidebarCollapsed: boolean;
}

const TAB_DESCRIPTIONS: Record<TabType, { title: string; desc: string }> = {
  dashboard: { title: 'Project Overview', desc: 'Real-time execution readiness assessment & risk summary' },
  analyze: { title: 'Ingest & Analyze Document', desc: 'Extract structured tasks, deadlines & risks from files or notes' },
  graph: { title: 'Execution Graph', desc: 'Interactive task connection map & critical dependency path' },
  audit: { title: 'Safety Audit & Risks', desc: 'Automated detection of circular dependencies & resource bottlenecks' },
  clarification: { title: 'Clarification Loop', desc: 'High-impact questions needing human input to unlock readiness' },
  whatif: { title: 'What-If Delay Simulator', desc: 'Test delay scenario impacts on project deadlines and team' },
  actionPlan: { title: 'Action Plan & Approvals', desc: 'Sequential task execution roadmap with step approvals' },
  groundedQA: { title: 'Ask Execora AI', desc: 'Grounded Q&A chat backed by Cognee memory & source evidence' },
  history: { title: 'Analysis History', desc: 'Past execution audits and source evidence traceability' },
  admin: { title: 'Admin Control Panel', desc: 'System status, API connectivity & database management' }
};

export const Header: React.FC<HeaderProps> = ({
  health,
  isDemoMode,
  activeTab,
  onToggleDemoMode,
  onLoadDemoData,
  onOpenTodaysPlan,
  onOpenAuth,
  onOpenSettings,
  isSidebarCollapsed
}) => {
  const { user, role, userGroqKey, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentMeta = TAB_DESCRIPTIONS[activeTab] || TAB_DESCRIPTIONS.dashboard;

  return (
    <header className="border-b border-slate-800/80 bg-[#0B1220]/90 backdrop-blur-md sticky top-0 z-40 py-3 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Page Context & Title */}
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>{currentMeta.title}</span>
          </h1>
          <p className="text-xs text-slate-400">
            {currentMeta.desc}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Quick Load Demo Data Button */}
          <button
            onClick={onLoadDemoData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-700/50 text-sky-200 text-xs font-semibold transition-all shadow-sm active:scale-95"
            title="Populate Hackathon preparation demo dataset"
          >
            <PlayCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Load Demo Data</span>
          </button>

          {/* Mode Switcher */}
          <button
            onClick={onToggleDemoMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isDemoMode
                ? 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/60'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isDemoMode ? 'Demo Mode' : 'Live Groq'}
          </button>

          {/* Today's Plan Shortcut */}
          <button
            onClick={onOpenTodaysPlan}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Today's Plan</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Configure Groq API Key and App Settings"
          >
            <Settings className="w-4 h-4 text-slate-400" />
          </button>

          {/* User Account / Auth Dropdown */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs transition-all"
                >
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold font-mono text-xs shadow">
                    {user.email.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-slate-200 font-medium truncate max-w-[100px]">
                    {user.email.split('@')[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 text-xs space-y-1">
                    <div className="p-2 border-b border-slate-800">
                      <div className="font-bold text-white truncate">{user.email}</div>
                      <div className="text-[10px] text-slate-400 capitalize">Role: {role}</div>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenSettings();
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-slate-300 flex items-center gap-2"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>Groq Key & Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-rose-950/60 text-rose-300 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-colors"
              >
                <User className="w-3.5 h-3.5 text-sky-400" />
                <span>Sign In</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
