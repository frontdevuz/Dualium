import type { QuizResult } from '../data';

const HISTORY_KEY = 'dualium-quiz-history';
const CURRENT_RESULT_KEY = 'dualium-current-quiz-result';

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

export function getQuizHistory(): QuizResult[] {
  const parsed = parseJson(localStorage.getItem(HISTORY_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

export function getCurrentQuizResult(): QuizResult | null {
  const parsed = parseJson(localStorage.getItem(CURRENT_RESULT_KEY));
  return parsed && !Array.isArray(parsed) ? (parsed as QuizResult) : null;
}

export function persistQuizResult(result: QuizResult) {
  const history = getQuizHistory();
  const nextHistory = [result, ...history].slice(0, 20);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  localStorage.setItem(CURRENT_RESULT_KEY, JSON.stringify(result));
}

export function clearCurrentQuizResult() {
  localStorage.removeItem(CURRENT_RESULT_KEY);
}
