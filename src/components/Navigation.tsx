import React from 'react';
import { LayoutDashboard, FileText, CheckSquare, MessageSquare, History, ShieldCheck, Layers, ShieldAlert, HelpCircle, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type TabType = 
  | 'dashboard' 
  | 'analyze' 
  | 'graph' 
  | 'audit' 
  | 'clarification' 
  | 'whatif' 
  | 'actionPlan' 
  | 'groundedQA' 
  | 'history' 
  | 'admin';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  taskCount: number;
  gapCount: number;
  riskCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  taskCount,
  gapCount,
  riskCount,
}) => {
  const { role, savedAnalyses } = useAuth();

  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      adminOnly: false,
    },
    {
      id: 'analyze' as TabType,
      label: 'Analyze & Extract',
      icon: FileText,
      badge: null,
      adminOnly: false,
    },
    {
      id: 'graph' as TabType,
      label: 'Execution Graph',
      icon: Layers,
      badge: null,
      adminOnly: false,
    },
    {
      id: 'audit' as TabType,
      label: 'Risk Audit',
      icon: ShieldAlert,
      badge: riskCount > 0 ? `${riskCount} Risks` : null,
      adminOnly: false,
    },
    {
      id: 'clarification' as TabType,
      label: 'Clarifications',
      icon: HelpCircle,
      badge: gapCount > 0 ? `${gapCount}` : null,
      adminOnly: false,
    },
    {
      id: 'whatif' as TabType,
      label: 'What-If Simulator',
      icon: PlayCircle,
      badge: 'SIM',
      adminOnly: false,
    },
    {
      id: 'actionPlan' as TabType,
      label: 'Action Plan & Approval',
      icon: CheckSquare,
      badge: taskCount > 0 ? `${taskCount} Tasks` : null,
      adminOnly: false,
    },
    {
      id: 'groundedQA' as TabType,
      label: 'Grounded Q&A',
      icon: MessageSquare,
      badge: null,
      adminOnly: false,
    },
    {
      id: 'history' as TabType,
      label: 'History',
      icon: History,
      badge: savedAnalyses.length > 0 ? `${savedAnalyses.length}` : null,
      adminOnly: false,
    },
    {
      id: 'admin' as TabType,
      label: 'Admin Panel',
      icon: ShieldCheck,
      badge: 'ADMIN',
      adminOnly: true,
    },
  ];

  return (
    <nav className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar">
          {tabs
            .filter((t) => !t.adminOnly || role === 'admin')
            .map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'border-sky-500 text-sky-400 bg-sky-950/20'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-mono font-bold ${
                        tab.id === 'admin'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : tab.id === 'audit'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : isActive
                          ? 'bg-sky-900/80 text-sky-200 border border-sky-700/50'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </div>
      </div>
    </nav>
  );
};
