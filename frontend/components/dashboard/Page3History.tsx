import React, { useState, useEffect } from 'react';
import {
  Clock,
  FolderArchive,
  FileText,
  FileCheck,
  Trash2,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink
} from 'lucide-react';
import { ExamResult } from '../../types';
import { UploadedFileRecord } from './types';

interface Page3HistoryProps {
  history: ExamResult[];
  onViewResult: (result: ExamResult) => void;
  onClearHistory: () => void;
  onStartNewExam: (initialTopic?: string, fileContent?: string) => void;
}

export const Page3History: React.FC<Page3HistoryProps> = ({
  history,
  onViewResult,
  onClearHistory,
  onStartNewExam,
}) => {
  const [activeTab, setActiveTab] = useState<'exams' | 'files'>('exams');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileRecord[]>([]);

  // Load uploaded files from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('soma_uploaded_files');
      if (saved) {
        setUploadedFiles(JSON.parse(saved));
      } else {
        // Initial baseline demo files
        const demoFiles: UploadedFileRecord[] = [
          {
            id: 'file_1',
            name: 'Advanced_Algorithms_Lecture_04.pdf',
            size: 2450000,
            type: 'application/pdf',
            uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            contentSnippet: 'Dynamic programming formulations, memoization vs tabulation, Bellman-Ford shortest paths and DAG relaxations.',
          },
          {
            id: 'file_2',
            name: 'Neuroscience_Synaptic_Transmission.pdf',
            size: 1820000,
            type: 'application/pdf',
            uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
            contentSnippet: 'Action potential kinetics, voltage-gated ion channels, neurotransmitter vesicle release at the presynaptic membrane.',
          },
          {
            id: 'file_3',
            name: 'Constitutional_Law_Summary.docx',
            size: 890000,
            type: 'application/docx',
            uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
            contentSnippet: 'Judicial review precedents, separation of powers, Commerce Clause interpretations from 1937 to modern jurisprudence.',
          },
        ];
        setUploadedFiles(demoFiles);
        localStorage.setItem('soma_uploaded_files', JSON.stringify(demoFiles));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDeleteFile = (id: string) => {
    const updated = uploadedFiles.filter((f) => f.id !== id);
    setUploadedFiles(updated);
    try {
      localStorage.setItem('soma_uploaded_files', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${bytes} B`;
  };

  const formatDateTime = (isoString?: string): string => {
    if (!isoString) return 'Recent';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Recent';
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filtered lists
  const filteredExams = history.filter((exam) => {
    const query = searchQuery.toLowerCase();
    const dateStr = exam.date ? formatDateTime(exam.date).toLowerCase() : '';
    return dateStr.includes(query) || (exam.feedback && exam.feedback.toLowerCase().includes(query));
  });

  const filteredFiles = uploadedFiles.filter((file) => {
    const query = searchQuery.toLowerCase();
    return (
      file.name.toLowerCase().includes(query) ||
      file.contentSnippet.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-4 px-4 sm:px-6">
      {/* Header and Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-surface-1 border border-border">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-mono text-text-3 uppercase tracking-wider">
            <Clock className="size-3.5 text-text-1" />
            <span>Temporal Archive</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-medium tracking-tight text-text-1 font-serif"
            style={{ fontFamily: "'ITC Garamond Std', Georgia, serif" }}
          >
            History & Study Materials
          </h2>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex items-center gap-1 p-1 bg-surface-2 border border-border">
          <button
            type="button"
            onClick={() => setActiveTab('exams')}
            className={`px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'exams'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-text-2 hover:text-text-1'
            }`}
          >
            Exam Sessions ({history.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'files'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-text-2 hover:text-text-1'
            }`}
          >
            Uploaded Materials ({uploadedFiles.length})
          </button>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'exams'
                ? 'Search exam history by date or feedback...'
                : 'Search uploaded materials by filename or keyword...'
            }
            className="w-full pl-9 pr-4 py-2 bg-surface-1 border border-border text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus:border-white"
          />
        </div>

        {activeTab === 'exams' && history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-surface-1 hover:bg-surface-2 border border-border text-xs text-text-2 hover:text-red-400 transition-colors"
          >
            <Trash2 className="size-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* TAB 1: Exam History */}
      {activeTab === 'exams' && (
        <div className="flex flex-col gap-3">
          {filteredExams.length === 0 ? (
            <div className="p-12 text-center bg-surface-1 border border-border flex flex-col items-center justify-center gap-3">
              <FolderArchive className="size-8 text-text-3" />
              <p className="text-sm text-text-2">
                No past exam sessions found. Complete your first assessment in the Studio.
              </p>
              <button
                type="button"
                onClick={() => onStartNewExam()}
                className="mt-2 px-4 py-2 bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all"
              >
                Go to Studio
              </button>
            </div>
          ) : (
            filteredExams.map((exam, idx) => {
              const formattedDate = formatDateTime(exam.date);
              const durationMins = Math.floor(exam.timeTaken / 60);
              const durationSecs = exam.timeTaken % 60;
              const isMastered = exam.score >= 80;

              return (
                <div
                  key={idx}
                  className="p-4 sm:p-5 bg-surface-1 border border-border hover:border-white/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-text-3 flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formattedDate}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 uppercase ${
                          isMastered
                            ? 'bg-white text-black font-semibold'
                            : 'bg-surface-2 text-text-2 border border-border'
                        }`}
                      >
                        {isMastered ? '[Mastered]' : '[Completed]'}
                      </span>
                    </div>

                    <h4 className="text-base font-semibold text-text-1">
                      Session Assessment #{filteredExams.length - idx}
                    </h4>

                    <div className="flex items-center gap-4 text-xs font-mono text-text-2">
                      <span>Questions: {exam.totalQuestions}</span>
                      <span>·</span>
                      <span>
                        Time: {durationMins > 0 ? `${durationMins}m ` : ''}{durationSecs}s
                      </span>
                    </div>

                    {exam.feedback && (
                      <p className="text-xs text-text-2 line-clamp-1 italic mt-1">
                        "{exam.feedback}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold font-mono text-text-1">
                        {exam.score}%
                      </span>
                      <span className="text-[10px] font-mono text-text-3">Accuracy</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onViewResult(exam)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-surface-2 hover:bg-surface-3 text-text-1 border border-border hover:border-white text-xs font-medium transition-all"
                    >
                      <span>Review</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: Uploaded Materials Archive */}
      {activeTab === 'files' && (
        <div className="flex flex-col gap-3">
          {filteredFiles.length === 0 ? (
            <div className="p-12 text-center bg-surface-1 border border-border flex flex-col items-center justify-center gap-3">
              <FileText className="size-8 text-text-3" />
              <p className="text-sm text-text-2">
                No uploaded study materials found. Attach files in the Studio to archive them here.
              </p>
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className="p-4 sm:p-5 bg-surface-1 border border-border hover:border-white/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="size-10 bg-surface-2 border border-border flex items-center justify-center shrink-0 text-text-1">
                    <FileText className="size-5" />
                  </div>

                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-text-1 truncate max-w-sm">
                        {file.name}
                      </h4>
                      <span className="text-[10px] font-mono uppercase bg-surface-2 text-text-3 px-1.5 py-0.5 border border-border">
                        {file.type.split('/').pop() || 'DOCUMENT'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-text-3">
                      <span>{formatFileSize(file.size)}</span>
                      <span>·</span>
                      <span>Uploaded {formatDateTime(file.uploadedAt)}</span>
                    </div>

                    <p className="text-xs text-text-2 line-clamp-2 mt-1">
                      {file.contentSnippet}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => onStartNewExam(file.name.replace(/\.[^/.]+$/, ''), file.fullContent)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all"
                    title="Generate personalized exam from this file"
                  >
                    <Sparkles className="size-3.5" />
                    <span>Generate Exam</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-2 text-text-3 hover:text-red-400 hover:bg-surface-2 border border-border transition-colors"
                    title="Delete file"
                    aria-label="Delete file"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Page3History;
