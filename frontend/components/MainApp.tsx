import React, { useState, useCallback, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import ExamScreen from './ExamScreen';
import InfoModal from './InfoModal';
import ResultsScreen from './ResultsScreen';
import { Question, ExamConfig, ExamResult } from '../types';
import ProfileSettingsModal from './ProfileSettingsModal';
import DashboardLayout from './dashboard/DashboardLayout';

type AppState = 'setup' | 'exam' | 'results';

interface MainAppProps {
  user: User;
  onLogout: () => void;
  onAvatarUpdate: (newAvatarUrl: string) => void;
}

const MainApp: React.FC<MainAppProps> = ({ user, onLogout, onAvatarUpdate }) => {
  const [appState, setAppState] = useState<AppState>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [currentResult, setCurrentResult] = useState<ExamResult | null>(null);
  const [examHistory, setExamHistory] = useState<ExamResult[]>(() => {
    try {
      const savedHistory = localStorage.getItem('examHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Failed to load exam history from local storage", error);
      return [];
    }
  });
  const [showProfileSettingsModal, setShowProfileSettingsModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleExamStart = useCallback((qs: Question[], config: ExamConfig) => {
    setQuestions(qs);
    setExamConfig(config);
    setAppState('exam');
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('examHistory', JSON.stringify(examHistory));
    } catch (error) {
      console.error("Failed to save exam history to local storage", error);
    }
  }, [examHistory]);

  const handleExamFinish = useCallback((result: ExamResult) => {
    setCurrentResult(result);
    setAppState('results');
  }, []);

  const handleViewHistoryResult = (result: ExamResult) => {
    setCurrentResult(result);
    setAppState('results');
  };

  const handleRestart = useCallback((finalResult: ExamResult) => {
    const resultWithDate = { ...finalResult, date: new Date().toISOString() };
    setExamHistory(prev => [resultWithDate, ...prev.slice(0, 9)]); // Keep last 10 exams

    setQuestions([]);
    setExamConfig(null);
    setCurrentResult(null);
    setAppState('setup');
  }, []);

  const handleClearHistory = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all exam history? This action cannot be undone.')) {
      setExamHistory([]);
    }
  }, []);

  const handleOpenProfileSettings = useCallback(() => {
    setShowProfileSettingsModal(true);
  }, []);

  if (appState === 'exam' && examConfig) {
    return (
      <div className="min-h-screen bg-base text-text-1">
        <ExamScreen questions={questions} config={examConfig} onFinish={handleExamFinish} />
      </div>
    );
  }

  if (appState === 'results' && currentResult) {
    return (
      <div className="min-h-screen bg-base text-text-1">
        <ResultsScreen result={currentResult} onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <>
      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
      {showProfileSettingsModal && (
        <ProfileSettingsModal
          user={user}
          onClose={() => setShowProfileSettingsModal(false)}
          onAvatarUpdate={onAvatarUpdate}
        />
      )}
      <DashboardLayout
        user={user}
        history={examHistory}
        onExamStart={handleExamStart}
        onViewResult={handleViewHistoryResult}
        onClearHistory={handleClearHistory}
        onLogout={onLogout}
        onOpenProfileSettings={handleOpenProfileSettings}
        onOpenInfoModal={() => setShowInfoModal(true)}
      />
    </>
  );
};

export default MainApp;
