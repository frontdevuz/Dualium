import type { DualiumLang } from './aiClient';

type FeedbackResultSummary = {
  scorePercent: number;
  correctCount: number;
  total: number;
  wrongCount: number;
  createdAt: string;
};

export type QuizFeedbackPayload = {
  lang: DualiumLang;
  firstName: string;
  lastName: string;
  feedback: string;
  result: FeedbackResultSummary;
};

export async function sendQuizFeedback(payload: QuizFeedbackPayload) {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = typeof data?.error === 'string' ? data.error : 'Failed to send feedback.';
    throw new Error(errorMessage);
  }

  return data;
}
