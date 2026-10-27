import React, { useState } from 'react';
import { ExamResult } from '../types';
import {
  BookOpen,
  BarChart2,
  Settings,
  XCircle,
  Calendar,
  Trophy,
  Clock,
  Flame,
  TrendingUp,
  Target
} from 'lucide-react';
import GearAnimation from './GearAnimation';
import TypewriterLoader from './TypewriterLoader';
import WeeklyPerformanceAnalysis from './WeeklyPerformanceAnalysis';
import ExamHistorySummary from './ExamHistorySummary';

interface EnhancedExamHistoryDashboardProps {
  history: ExamResult[];
  onViewResult: (result: ExamResult) => void;
  onClearHistory: () => void;
  onStartNewExam: () => void;
}

const EnhancedExamHistoryDashboard: React.FC<EnhancedExamHistoryDashboardProps> = ({
  history,
  onViewResult,
  onClearHistory,
  onStartNewExam
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'history'>('overview');

  const statistics = React.useMemo(() => {
    if (history.length === 0) {
      return {
        totalExams: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        bestScore: 0,
        currentStreak: 0,
        improvementRate: 0
      };
    }

    const totalExams = history.length;
    const averageScore = history.reduce((sum, exam) => sum + (exam.score || 0), 0) / totalExams;
    const totalTimeSpent = history.reduce((sum, exam) => sum + exam.timeTaken, 0);
    const bestScore = Math.max(...history.map(exam => exam.score || 0));

    // Calculate current streak (consecutive days with exams)
    let currentStreak = 0;
    const sortedExams = [...history].sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedExams.length; i++) {
      const examDate = new Date(sortedExams[i].date || '');
      examDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - examDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate improvement rate (compare recent 3 vs previous 3)
    const recent = history.slice(0, 3);
    const previous = history.slice(3, 6);
    const improvementRate = recent.length > 0 && previous.length > 0
      ? (recent.reduce((sum, exam) => sum + (exam.score || 0), 0) / recent.length) -
        (previous.reduce((sum, exam) => sum + (exam.score || 0), 0) / previous.length)
      : 0;

    return {
      totalExams,
      averageScore: Math.round(averageScore),
      totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
      bestScore: Math.round(bestScore),
      currentStreak,
      improvementRate: Math.round(improvementRate)
    };
  }, [history]);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
    animate?: boolean;
  }> = ({ icon, title, value, subtitle, color = "blue", animate = false }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors duration-300">{title}</p>
            <p className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400 transition-colors duration-300`}>{value}</p>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">{subtitle}</p>
            )}
          </div>
        </div>
        {animate && (
          <div className="w-16 h-16 opacity-20">
            <GearAnimation isActive={true} size={1.5} color={`var(--color-${color}-500)`} />
          </div>
        )}
      </div>
    </div>
  );

  if (history.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg text-center transition-colors duration-300">
          <div className="w-32 h-32 mx-auto mb-6">
            <TypewriterLoader />
          </div>
          <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4 transition-colors duration-300">
            Welcome to Your Exam Dashboard
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 transition-colors duration-300">
            Start your first exam to unlock comprehensive performance analytics and tracking!
          </p>
          <button
            onClick={onStartNewExam}
            className="bg-primary-600 hover:bg-primary-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Take Your First Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-700 dark:text-slate-300 transition-colors duration-300">
            Exam Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
            Track your progress and analyze performance trends
          </p>
        </div>
        <button
          onClick={onStartNewExam}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
        >
          <BookOpen className="h-5 w-5" />
          Start New Exam
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card rounded-lg shadow-lg p-1 transition-colors duration-200">
        <div className="flex flex-wrap">
          {[
            { id: 'overview', label: 'Overview', icon: Trophy },
            { id: 'analytics', label: 'Analytics', icon: BarChart2 },
            { id: 'history', label: 'History', icon: Calendar }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              icon={<Trophy className="h-6 w-6" />}
              title="Total Exams"
              value={statistics.totalExams}
              subtitle="Completed"
              color="blue"
            />
            <StatCard
              icon={<BarChart2 className="h-6 w-6" />}
              title="Average Score"
              value={`${statistics.averageScore}%`}
              subtitle={statistics.averageScore >= 80 ? "Excellent!" : statistics.averageScore >= 70 ? "Good" : "Keep trying"}
              color={statistics.averageScore >= 80 ? "green" : statistics.averageScore >= 70 ? "yellow" : "red"}
            />
            <StatCard
              icon={<Clock className="h-6 w-6" />}
              title="Time Spent"
              value={`${statistics.totalTimeSpent}m`}
              subtitle="Total minutes"
              color="purple"
            />
            <StatCard
              icon={<Flame className="h-6 w-6" />}
              title="Best Score"
              value={`${statistics.bestScore}%`}
              subtitle="Personal record"
              color="orange"
            />
            <StatCard
              icon={<Calendar className="h-6 w-6" />}
              title="Current Streak"
              value={statistics.currentStreak}
              subtitle={statistics.currentStreak === 1 ? "day" : "days"}
              color="red"
            />
            <StatCard
              icon={<Settings className="h-6 w-6" />}
              title="Improvement"
              value={`${statistics.improvementRate > 0 ? '+' : ''}${statistics.improvementRate}%`}
              subtitle={statistics.improvementRate > 0 ? "Getting better!" : "Keep practicing"}
              color={statistics.improvementRate > 0 ? "green" : "orange"}
              animate={true}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4 transition-colors duration-300">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setActiveTab('analytics')}
                className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/10 transition-all"
              >
                <BarChart2 className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium text-foreground transition-colors duration-200">View Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-dashed border-border hover:border-success hover:bg-success/10 transition-all"
              >
                <BookOpen className="h-8 w-8 text-success" />
                <span className="text-sm font-medium text-foreground transition-colors duration-200">Exam History</span>
              </button>
              <button
                onClick={onStartNewExam}
                className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-dashed border-border hover:border-warning hover:bg-warning/10 transition-all"
              >
                <BookOpen className="h-8 w-8 text-warning" />
                <span className="text-sm font-medium text-foreground transition-colors duration-200">New Exam</span>
              </button>
              <button
                onClick={onClearHistory}
                className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-dashed border-border hover:border-destructive hover:bg-destructive/10 transition-all"
              >
                <XCircle className="h-8 w-8 text-destructive" />
                <span className="text-sm font-medium text-foreground transition-colors duration-200">Clear Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Animated Analysis Header */}
          <div className="bg-card p-6 rounded-lg shadow-lg transition-colors duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <TypewriterLoader />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground transition-colors duration-200">
                  Performance Analysis
                </h3>
                <p className="text-muted-foreground transition-colors duration-200">
                  Advanced insights into your learning progress
                </p>
              </div>
            </div>
          </div>

          <WeeklyPerformanceAnalysis
            examHistory={history}
            onViewDetailedResult={onViewResult}
          />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="flex justify-center items-center mb-4">
            <h3 className="text-xl font-bold text-foreground mr-auto transition-colors duration-200">
              Detailed Exam History
            </h3>
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1 text-sm font-medium text-destructive hover:opacity-90 transition-opacity"
              title="Clear all history"
            >
              <XCircle className="h-4 w-4" />
              <span>Clear History</span>
            </button>
          </div>
          <ExamHistorySummary
            history={history}
            onViewResult={onViewResult}
            onClearHistory={onClearHistory}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedExamHistoryDashboard;
