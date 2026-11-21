import { ExamResult, Question, ExamConfig } from '../../types';

export type DashboardView = 'studio' | 'analytics' | 'history' | 'library' | 'focus';

export interface UploadedFileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  contentSnippet: string;
  fullContent?: string;
  mimeType?: string;
}

export interface Quote {
  text: string;
  author: string;
  context: string;
}

export interface SystemNode {
  id: string;
  label: string;
  category: string;
  mastery: number; // 0 - 100
  x: number;
  y: number;
  connections: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}
