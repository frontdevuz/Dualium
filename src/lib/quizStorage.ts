import type { DualiumLang } from './aiClient';
import type { QuizGradeResult } from './quizGrader';

const HISTORY_KEY = 'dualium-offline-quiz-history';
const LATEST_KEY = 'dualium-offline-quiz-latest';

export type StoredQuizAttempt = QuizGradeResult & {
  id: string;
  lang: DualiumLang;
  createdAt: string;
  participantName?: string;
  elapsedMs?: number;
};

function parseJson(raw: string | null): unknown {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function getQuizAttemptHistory(): StoredQuizAttempt[] {
  const parsed = parseJson(localStorage.getItem(HISTORY_KEY));
  return Array.isArray(parsed) ? (parsed as StoredQuizAttempt[]) : [];
}

export function getLatestQuizAttempt(): StoredQuizAttempt | null {
  const parsed = parseJson(localStorage.getItem(LATEST_KEY));
  if (!parsed || Array.isArray(parsed)) {
    return null;
  }

  return parsed as StoredQuizAttempt;
}

export function saveQuizAttempt(attempt: StoredQuizAttempt) {
  const history = getQuizAttemptHistory();
  const nextHistory = [attempt, ...history].slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  localStorage.setItem(LATEST_KEY, JSON.stringify(attempt));
}
