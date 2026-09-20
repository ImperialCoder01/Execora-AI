import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TabType } from './components/Navigation';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { AnalyzeInputView } from './components/AnalyzeInputView';
import { ActionPlanView } from './components/ActionPlanView';
import { GroundedQA } from './components/GroundedQA';
import { ExecutionGraphView } from './components/ExecutionGraphView';
import { RiskAuditView } from './components/RiskAuditView';
import { ClarificationView } from './components/ClarificationView';
import { WhatIfView } from './components/WhatIfView';
import { AdminDashboard } from './components/AdminDashboard';
import { HistoryView } from './components/HistoryView';
import { TodaysPlanModal } from './components/TodaysPlanModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { DEMO_ANALYSIS, DEMO_RAW_TEXT } from './data/demoAnalysis';
import { SamplePreset } from './data/sampleInputs';
import { AnalysisResult, TaskStatus } from './types';
import { fetchHealthStatus, analyzeTextAPI, HealthStatus } from './services/api';
import { answerClarification } from './utils/clarificationLoop';

const AppContent: React.FC = () => {
  const { userGroqKey, saveAnalysisToHistory } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const [health, setHealth] = useState<HealthStatus>({
    status: 'checking',
    groqConfigured: false,
    model: 'llama-3.3-70b-versatile',
  });
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [rawText, setRawText] = useState<string>(DEMO_RAW_TEXT);
  const [analysis, setAnalysis] = useState<AnalysisResult>(DEMO_ANALYSIS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('hackathon-meeting');

  // Modals
  const [isTodaysPlanOpen, setIsTodaysPlanOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchHealthStatus().then((res) => {
      setHealth(res);
      if (!res.groqConfigured && !userGroqKey) {
        setIsDemoMode(true);
      }
    });
  }, [userGroqKey]);

  const handleToggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const handleLoadDemoData = () => {
    setRawText(DEMO_RAW_TEXT);
    setAnalysis(DEMO_ANALYSIS);
    setSelectedPresetId('hackathon-meeting');
    setIsDemoMode(true);
    setActiveTab('dashboard');
  };

  const handleSelectPreset = (preset: SamplePreset) => {
    setSelectedPresetId(preset.id);
    setRawText(preset.text);
    if (preset.analysis) {
      setAnalysis(preset.analysis);
      saveAnalysisToHistory(preset.analysis);
    }
    setActiveTab('analyze');
  };

  const handleAnalyze = async (forceDemoOverride?: boolean) => {
    if (!rawText.trim()) return;
    setIsLoading(true);
    const useDemo = forceDemoOverride !== undefined ? forceDemoOverride : (isDemoMode && !userGroqKey);

    try {
      const res = await analyzeTextAPI(rawText, useDemo, userGroqKey);
      setAnalysis(res);
      saveAnalysisToHistory(res);
      setActiveTab('dashboard');
    } catch (err) {
      console.error("Analysis failed:", err);
      setAnalysis({ ...DEMO_ANALYSIS, isDemo: true });
      setActiveTab('dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setAnalysis((prev) => {
      const updated = {
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      };
      saveAnalysisToHistory(updated);
      return updated;
    });
  };

  const handleAnswerClarification = (clarificationId: string, answer: string) => {
    const result = answerClarification(analysis, clarificationId, answer);
    setAnalysis(result.updatedAnalysis);
    saveAnalysisToHistory(result.updatedAnalysis);
  };

  const handleRestoreAnalysis = (restored: AnalysisResult) => {
    setAnalysis(restored);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* Sleek Vertical Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        taskCount={analysis.tasks.length}
        gapCount={analysis.clarifications.filter(c => c.status === 'OPEN').length}
        riskCount={analysis.risks.length}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isDemoMode={isDemoMode}
      />

      {/* Main App Workspace Layout (Shifted right by sidebar width) */}
      <div className={`transition-all duration-300 flex-1 flex flex-col ${isSidebarCollapsed ? 'pl-16' : 'pl-64'}`}>
        
        {/* Streamlined Top Header */}
        <Header
          health={health}
          isDemoMode={isDemoMode}
          activeTab={activeTab}
          onToggleDemoMode={handleToggleDemoMode}
          onLoadDemoData={handleLoadDemoData}
          onOpenTodaysPlan={() => setIsTodaysPlanOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Main Viewport Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <AnalysisDashboard
              analysis={analysis}
              onTaskStatusChange={handleTaskStatusChange}
              onNavigateTab={setActiveTab}
              onOpenTodaysPlan={() => setIsTodaysPlanOpen(true)}
            />
          )}

          {activeTab === 'analyze' && (
            <AnalyzeInputView
              rawText={rawText}
              onTextChange={setRawText}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              onSelectPreset={handleSelectPreset}
              selectedPresetId={selectedPresetId}
            />
          )}

          {activeTab === 'graph' && (
            <ExecutionGraphView
              tasks={analysis.tasks}
              dependencies={analysis.dependencies}
              entities={analysis.entities}
            />
          )}

          {activeTab === 'audit' && (
            <RiskAuditView risks={analysis.risks} />
          )}

          {activeTab === 'clarification' && (
            <ClarificationView
              clarifications={analysis.clarifications}
              onAnswerClarification={handleAnswerClarification}
              previousScore={analysis.previousScore}
              scoreChangeReason={analysis.scoreChangeReason}
              currentScore={analysis.readinessScore}
            />
          )}

          {activeTab === 'whatif' && (
            <WhatIfView analysis={analysis} />
          )}

          {activeTab === 'actionPlan' && (
            <ActionPlanView
              actionPlan={analysis.actionPlan}
              onOpenTodaysPlan={() => setIsTodaysPlanOpen(true)}
            />
          )}

          {activeTab === 'groundedQA' && (
            <GroundedQA
              rawText={rawText}
              analysis={analysis}
              isDemoMode={isDemoMode && !userGroqKey}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView onRestoreAnalysis={handleRestoreAnalysis} />
          )}

          {activeTab === 'admin' && <AdminDashboard />}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/60 py-4 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Execora AI Readiness Engine — AI Day Noida Problem Statement 02</span>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Groq LLaMA 3.3 70B • Cognee Cloud • Supabase</span>
              <span>•</span>
              <button onClick={() => setIsSettingsOpen(true)} className="text-sky-400 hover:underline">
                Groq Settings
              </button>
            </div>
          </div>
        </footer>

      </div>

      {/* Modals */}
      <TodaysPlanModal
        isOpen={isTodaysPlanOpen}
        onClose={() => setIsTodaysPlanOpen(false)}
        analysis={analysis}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
