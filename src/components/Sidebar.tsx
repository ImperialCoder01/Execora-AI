import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  ShieldAlert, 
  HelpCircle, 
  PlayCircle, 
  CheckSquare, 
  MessageSquare, 
  History, 
  ShieldCheck, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Sparkles,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TabType } from './Navigation';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  taskCount: number;
  gapCount: number;
  riskCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isDemoMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  taskCount,
  gapCount,
  riskCount,
  isCollapsed,
  onToggleCollapse,
  isDemoMode
}) => {
  const { role, savedAnalyses } = useAuth();

  const navSections = [
    {
      title: 'WORKSPACE',
      items: [
        {
          id: 'dashboard' as TabType,
          label: 'Overview',
          description: 'Execution readiness & summary',
          icon: LayoutDashboard,
          badge: null
        },
        {
          id: 'analyze' as TabType,
          label: 'Ingest & Analyze',
          description: 'Upload docs or paste project text',
          icon: FileText,
          badge: null
        },
        {
          id: 'graph' as TabType,
          label: 'Execution Graph',
          description: 'Interactive task connection map',
          icon: Layers,
          badge: null
        }
      ]
    },
    {
      title: 'AUDIT & SAFETY',
      items: [
        {
          id: 'audit' as TabType,
          label: 'Risk Audit',
          description: 'Bottlenecks & circular dependencies',
          icon: ShieldAlert,
          badge: riskCount > 0 ? `${riskCount}` : null,
          badgeColor: 'bg-rose-950 text-rose-300 border-rose-800'
        },
        {
          id: 'clarification' as TabType,
          label: 'Clarifications',
          description: 'Questions needing human input',
          icon: HelpCircle,
          badge: gapCount > 0 ? `${gapCount}` : null,
          badgeColor: 'bg-amber-950 text-amber-300 border-amber-800'
        },
        {
          id: 'whatif' as TabType,
          label: 'What-If Simulator',
          description: 'Test delay scenario impacts',
          icon: PlayCircle,
          badge: 'SIM',
          badgeColor: 'bg-purple-950 text-purple-300 border-purple-800'
        }
      ]
    },
    {
      title: 'EXECUTION & PLANS',
      items: [
        {
          id: 'actionPlan' as TabType,
          label: 'Action Plan',
          description: 'Step-by-step task roadmap',
          icon: CheckSquare,
          badge: taskCount > 0 ? `${taskCount}` : null,
          badgeColor: 'bg-sky-950 text-sky-300 border-sky-800'
        },
        {
          id: 'groundedQA' as TabType,
          label: 'Ask Execora AI',
          description: 'Grounded Q&A chat assistant',
          icon: MessageSquare,
          badge: 'AI',
          badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800'
        },
        {
          id: 'history' as TabType,
          label: 'History & Evidence',
          description: 'Past project analyses & citations',
          icon: History,
          badge: savedAnalyses.length > 0 ? `${savedAnalyses.length}` : null,
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
        }
      ]
    }
  ];

  if (role === 'admin') {
    navSections.push({
      title: 'ADMINISTRATION',
      items: [
        {
          id: 'admin' as TabType,
          label: 'Admin Control',
          description: 'System health & user management',
          icon: ShieldCheck,
          badge: 'ADMIN',
          badgeColor: 'bg-purple-950 text-purple-300 border-purple-800'
        }
      ]
    });
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen bg-[#090D16] border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-md shadow-sky-500/20">
              <img src="/brand/icon.svg" alt="Execora" className="h-6 w-6 object-contain" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-tight">Execora</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate">Readiness Engine</p>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Section Items */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] no-scrollbar">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-600/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                      {!isCollapsed && (
                        <div className="text-left truncate">
                          <div className="truncate">{item.label}</div>
                        </div>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-full border ${
                        isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${isDemoMode ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <div className="text-[11px] font-medium text-slate-300">
                {isDemoMode ? 'Demo Mode' : 'Live Groq Engine'}
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              v0.1
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className={`h-3 w-3 rounded-full ${isDemoMode ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          </div>
        )}
      </div>
    </aside>
  );
};
