import type { Question } from '../data/quizzes';

export type GradedQuestionItem = {
  qid: string;
  prompt: string;
  type: Question['type'];
  correctAnswer: string | boolean;
  userAnswer: string | boolean;
  source: Question['source'];
  explanationContext?: string;
};

export type QuizGradeResult = {
  total: number;
  correctCount: number;
  wrong: GradedQuestionItem[];
  correct: GradedQuestionItem[];
};

const PUNCTUATION_REGEX = /[^\p{L}\p{N}\s]/gu;

export function normalizeText(input: string) {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(PUNCTUATION_REGEX, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(a: string, b: string) {
  const rows = a.length + 1;
  const cols = b.length + 1;

  const matrix: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) {
    matrix[i][0] = i;
  }
  for (let j = 0; j < cols; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[rows - 1][cols - 1];
}

function similarity(a: string, b: string) {
  if (a === b) {
    return 1;
  }

  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) {
    return 1;
  }

  const distance = levenshteinDistance(a, b);
  return 1 - distance / maxLen;
}

export function isShortAnswerCorrect(
  user: string,
  answer: string,
  acceptedAnswers: string[] = [],
) {
  const normalizedUser = normalizeText(user);
  if (!normalizedUser) {
    return false;
  }

  const candidates = [answer, ...acceptedAnswers].map((item) => normalizeText(item)).filter(Boolean);

  if (candidates.includes(normalizedUser)) {
    return true;
  }

  return candidates.some((candidate) => {
    if (Math.min(candidate.length, normalizedUser.length) <= 3) {
      return false;
    }
    return similarity(normalizedUser, candidate) >= 0.86;
  });
}

function normalizeBooleanAnswer(value: string | boolean) {
  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = normalizeText(value);

  if (['true', 'togri', 'to g ri', 'ha', 'yes'].includes(normalized)) {
    return true;
  }

  if (['false', 'notogri', 'no', 'yoq', 'yo q', 'not true'].includes(normalized)) {
    return false;
  }

  return null;
}

export function gradeQuiz(
  questions: Question[],
  userAnswers: Record<string, string | boolean | undefined>,
): QuizGradeResult {
  const correct: GradedQuestionItem[] = [];
  const wrong: GradedQuestionItem[] = [];

  for (const question of questions) {
    const rawUserAnswer = userAnswers[question.id];
    const userAnswer: string | boolean =
      rawUserAnswer === undefined ? '' : rawUserAnswer;

    let isCorrect = false;

    if (question.type === 'short' && typeof question.answer === 'string') {
      isCorrect = isShortAnswerCorrect(String(userAnswer), question.answer, question.acceptedAnswers);
    } else if (question.type === 'tf' && typeof question.answer === 'boolean') {
      const normalized = normalizeBooleanAnswer(userAnswer);
      isCorrect = normalized !== null && normalized === question.answer;
    } else {
      isCorrect = normalizeText(String(userAnswer)) === normalizeText(String(question.answer));
    }

    const row: GradedQuestionItem = {
      qid: question.id,
      prompt: question.prompt,
      type: question.type,
      correctAnswer: question.answer,
      userAnswer,
      source: question.source,
      explanationContext: question.explanationContext,
    };

    if (isCorrect) {
      correct.push(row);
    } else {
      wrong.push(row);
    }
  }

  return {
    total: questions.length,
    correctCount: correct.length,
    wrong,
    correct,
  };
}
