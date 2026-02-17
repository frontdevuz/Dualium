export type Region = 'east' | 'west';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuizScope = 'east' | 'west' | 'mixed' | 'article';

export interface Concept {
  id: number;
  slug: string;
  name_en: string;
  name_uz: string;
  region: Region | 'both';
}

export interface Article {
  id: number;
  slug: string;
  region: Region;
  school: string;
  title_uz: string;
  title_en: string;
  summary_uz: string;
  summary_en: string;
  content_uz: string;
  content_en: string;
  concepts: string[];
  keyTakeaways_uz: string[];
  keyTakeaways_en: string[];
  readingTime: number;
  timelineYear: number;
}

export interface Philosopher {
  id: number;
  slug: string;
  name: string;
  portrait: string;
  region: Region;
  era: string;
  school: string;
  bio_uz: string;
  bio_en: string;
  quote_uz: string;
  quote_en: string;
  quote_source?: string;
  keyIdeas_uz: string[];
  keyIdeas_en: string[];
  relatedArticles: string[];
  timelineYear: number;
}

export type QuizQuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
  sourceArticleTitle: string;
  sourceSection: string;
}

export interface QuizSetup {
  language: 'en' | 'uz';
  scope: QuizScope;
  difficulty: Difficulty;
  questionCount: 5 | 10 | 20;
  articleSlug?: string;
}

export interface QuizEvaluationItem {
  question: QuizQuestion;
  userAnswer: string | boolean;
  isCorrect: boolean;
}

export interface QuizResult {
  id: string;
  createdAt: string;
  setup: QuizSetup;
  score: number;
  correctCount: number;
  incorrectCount: number;
  items: QuizEvaluationItem[];
}
