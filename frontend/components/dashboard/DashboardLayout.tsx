import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Menu, X, Sparkles, BookOpen } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Page1Studio } from './Page1Studio';
import { Page2Analytics } from './Page2Analytics';
import { Page3History } from './Page3History';
import { Page4Library } from './Page4Library';
import { Page5FocusRoom } from './Page5FocusRoom';
import { DashboardView, UploadedFileRecord } from './types';
import { ExamConfig, ExamResult, Question } from '../../types';
import AppIcon from '../AppIcon';

interface DashboardLayoutProps {
  user: User;
  history: ExamResult[];
  onExamStart: (questions: Question[], config: ExamConfig) => void;
  onViewResult: (result: ExamResult) => void;
  onClearHistory: () => void;
  onLogout: () => void;
  onOpenProfileSettings: () => void;
  onOpenInfoModal: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  history,
  onExamStart,
  onViewResult,
  onClearHistory,
  onLogout,
  onOpenProfileSettings,
  onOpenInfoModal,
}) => {
  const [currentView, setCurrentView] = useState<DashboardView>('studio');
  const [studioVisitKey, setStudioVisitKey] = useState<number>(0);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Learner';
  const avatarUrl = `https://api.dicebear.com/10.x/triangles/svg?seed=${encodeURIComponent(userName)}`;

  const handleSelectView = (v: DashboardView) => {
    if (v === 'studio') {
      setStudioVisitKey((prev) => prev + 1);
    }
    setCurrentView(v);
    setMobileMenuOpen(false);
  };

  const handleStartExamFromTopicOrFile = (initialTopic?: string, fileContent?: string) => {
    handleSelectView('studio');
  };

  const handleFileUploaded = (file: UploadedFileRecord) => {
    // Handled in storage and state
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-base text-text-1 selection:bg-white/20 selection:text-white">
      {/* Desktop Collapsible Sidebar (Borrowing UI-sample.png context) */}
      <div className="hidden md:flex h-full shrink-0 z-20">
        <Sidebar
          currentView={currentView}
          onSelectView={handleSelectView}
          user={user}
          onLogout={onLogout}
          onOpenProfileSettings={onOpenProfileSettings}
          onOpenInfoModal={onOpenInfoModal}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        />
      </div>

      {/* Mobile Drawer Navigation Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-64 z-50 md:hidden transform transition-transform duration-300 ease-spring ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          currentView={currentView}
          onSelectView={handleSelectView}
          user={user}
          onLogout={onLogout}
          onOpenProfileSettings={onOpenProfileSettings}
          onOpenInfoModal={onOpenInfoModal}
          collapsed={false}
          onToggleCollapse={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-base">
        {/* Mobile Top Header */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-border bg-surface-1 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-text-2 hover:text-text-1 hover:bg-surface-2 border border-border transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </button>

            <div className="flex items-center gap-2">
              <AppIcon className="size-7 rounded-full shrink-0" />
              <span
                className="font-['Preospe'] text-lg font-bold tracking-tight text-text-1"
                style={{ fontFamily: "'Preospe', sans-serif" }}
              >
                Somma
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenProfileSettings}
            className="flex items-center gap-2 p-1 border border-border bg-surface-2"
          >
            <img src={avatarUrl} alt={userName} className="size-7 bg-surface-3" />
          </button>
        </header>

        {/* Scrollable View Container (Shifted to center for studio view) */}
        <main
          className={`flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 flex flex-col ${
            currentView === 'studio' ? 'justify-center items-center' : ''
          }`}
        >
          {currentView === 'studio' && (
            <Page1Studio
              key={`studio-${studioVisitKey}`}
              user={user}
              onExamStart={onExamStart}
              onFileUploaded={handleFileUploaded}
            />
          )}

          {currentView === 'analytics' && <Page2Analytics history={history} />}

          {currentView === 'history' && (
            <Page3History
              history={history}
              onViewResult={onViewResult}
              onClearHistory={onClearHistory}
              onStartNewExam={handleStartExamFromTopicOrFile}
            />
          )}

          {currentView === 'library' && <Page4Library />}

          {currentView === 'focus' && <Page5FocusRoom />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
