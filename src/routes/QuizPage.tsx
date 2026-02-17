import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { SeoMeta } from '../components/SeoMeta';
import { LeaderboardPanel } from '../components/LeaderboardPanel';
import { SectionTitle } from '../components/SectionTitle';
import { getQuestionsByLang, quizzes, type Question } from '../data/quizzes';
import { type DualiumLang } from '../lib/aiClient';
import { fetchLeaderboard, formatLeaderboardDuration, submitLeaderboardEntry } from '../lib/leaderboardClient';
import { gradeQuiz } from '../lib/quizGrader';
import { getQuizAttemptHistory, saveQuizAttempt } from '../lib/quizStorage';
import { cn, shuffle } from '../lib/utils';

const quizSetupSchema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  language: z.enum(['en', 'uz']),
  questionCount: z.enum(['5', '10', '20']),
});

type QuizSetupFormValues = z.infer<typeof quizSetupSchema>;

type AnswerMap = Record<string, string | boolean>;

function createAttemptId() {
  if ('randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function QuizPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const initialLanguage: DualiumLang = i18n.resolvedLanguage?.startsWith('uz') ? 'uz' : 'en';

  const form = useForm<QuizSetupFormValues>({
    resolver: zodResolver(quizSetupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      language: initialLanguage,
      questionCount: '10',
    },
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [activeLanguage, setActiveLanguage] = useState<DualiumLang>(initialLanguage);
  const [participantName, setParticipantName] = useState('');
  const [quizStartedAt, setQuizStartedAt] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const history = useMemo(() => getQuizAttemptHistory(), [questions.length, isSubmitting]);

  const {
    data: leaderboardEntries = [],
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useQuery({
    queryKey: ['leaderboard', 'top5'],
    queryFn: () => fetchLeaderboard(5),
    refetchInterval: 60_000,
  });

  const canSubmit = useMemo(() => {
    if (questions.length === 0) {
      return false;
    }

    return questions.every((question) => {
      const value = answers[question.id];
      if (question.type === 'short') {
        return typeof value === 'string' && value.trim().length > 0;
      }

      return typeof value === 'string' || typeof value === 'boolean';
    });
  }, [answers, questions]);

  const onGenerate = form.handleSubmit((values) => {
    const langPool = getQuestionsByLang(values.language);
    const requestedCount = Number(values.questionCount);

    let selected = shuffle(langPool).slice(0, requestedCount);

    if (selected.length < requestedCount) {
      const selectedIds = new Set(selected.map((item) => item.id));
      const filler = shuffle(quizzes.filter((item) => !selectedIds.has(item.id))).slice(
        0,
        requestedCount - selected.length,
      );
      selected = [...selected, ...filler];
    }

    setActiveLanguage(values.language);
    setQuestions(selected);
    setAnswers({});
    setParticipantName(`${values.firstName.trim()} ${values.lastName.trim()}`.trim());
    setQuizStartedAt(Date.now());
  });

  const onSubmitQuiz = async () => {
    if (!canSubmit || questions.length === 0 || isSubmitting) {
      return;
    }

    const derivedName = participantName || `${form.getValues('firstName')} ${form.getValues('lastName')}`.trim();
    const grade = gradeQuiz(questions, answers);
    const scorePercent = grade.total > 0 ? Math.round((grade.correctCount / grade.total) * 100) : 0;
    const elapsedMs = Math.max(1000, (quizStartedAt ? Date.now() - quizStartedAt : 0) || 1000);

    const attempt = {
      id: createAttemptId(),
      lang: activeLanguage,
      createdAt: new Date().toISOString(),
      participantName: derivedName || (activeLanguage === 'uz' ? 'Noma`lum' : 'Anonymous'),
      elapsedMs,
      ...grade,
    };

    saveQuizAttempt(attempt);

    setIsSubmitting(true);
    try {
      await submitLeaderboardEntry({
        name: attempt.participantName ?? (activeLanguage === 'uz' ? 'Noma`lum' : 'Anonymous'),
        scorePercent,
        correctCount: grade.correctCount,
        total: grade.total,
        elapsedMs,
        lang: activeLanguage,
        submittedAt: attempt.createdAt,
      });
    } catch {
      // Leaderboard submission failure should not block quiz result flow.
    } finally {
      setIsSubmitting(false);
    }

    navigate('/quiz/result');
  };

  return (
    <>
      <SeoMeta
        title={`${t('common.quiz')} | Dualium`}
        description="Offline quiz grading powered by local Dualium knowledge data."
        canonical="https://dualium.vercel.app/quiz"
        ogTitle={`${t('common.quiz')} | Dualium`}
        ogDescription="Offline quiz grading powered by local Dualium knowledge data."
        lang={activeLanguage}
      />

      <SectionTitle
        title={t('quiz.title')}
        description={
          activeLanguage === 'uz'
            ? 'Baholash toliq lokal ishlaydi. Tashqi test API ishlatilmaydi.'
            : 'Grading runs fully offline using local quiz data. No external test API is used.'
        }
      />

      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <form onSubmit={onGenerate} className="rounded-2xl border border-zinc-200/70 bg-white/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/70">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">{t('quiz.setup')}</h2>

          <div className="mt-4 space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-200">
                {activeLanguage === 'uz' ? 'Ism' : 'First name'}
              </span>
              <input
                type="text"
                {...form.register('firstName')}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
              {form.formState.errors.firstName ? (
                <p className="mt-1 text-xs text-rose-500">
                  {activeLanguage === 'uz' ? 'Ism kamida 2 ta belgi bo`lishi kerak.' : 'First name must be at least 2 characters.'}
                </p>
              ) : null}
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-200">
                {activeLanguage === 'uz' ? 'Familiya' : 'Last name'}
              </span>
              <input
                type="text"
                {...form.register('lastName')}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
              {form.formState.errors.lastName ? (
                <p className="mt-1 text-xs text-rose-500">
                  {activeLanguage === 'uz' ? 'Familiya kamida 2 ta belgi bo`lishi kerak.' : 'Last name must be at least 2 characters.'}
                </p>
              ) : null}
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-200">{t('quiz.language')}</span>
              <select
                {...form.register('language')}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="en">EN</option>
                <option value="uz">UZ</option>
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-200">{t('quiz.questionCount')}</span>
              <select
                {...form.register('questionCount')}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {activeLanguage === 'uz' ? 'Testni boshlash' : 'Start quiz'}
            </button>
          </div>

          <div className="mt-7">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{t('quiz.attemptHistory')}</h3>
            {history.length === 0 ? (
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{t('quiz.noHistory')}</p>
            ) : (
              <div className="mt-2 space-y-2">
                {history.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-lg border border-zinc-200 bg-zinc-50/90 px-3 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-900/80">
                    {item.participantName ? (
                      <p className="font-semibold text-zinc-700 dark:text-zinc-200">{item.participantName}</p>
                    ) : null}
                    <p className="font-medium text-zinc-700 dark:text-zinc-200">
                      {Math.round((item.correctCount / Math.max(item.total, 1)) * 100)}%
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      {new Date(item.createdAt).toLocaleString()} · {item.correctCount}/{item.total}
                      {item.elapsedMs ? ` · ${formatLeaderboardDuration(item.elapsedMs, item.lang)}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-7">
            <LeaderboardPanel
              lang={activeLanguage}
              entries={leaderboardEntries}
              isLoading={leaderboardLoading}
              errorMessage={leaderboardError instanceof Error ? leaderboardError.message : null}
              title={activeLanguage === 'uz' ? 'Top 5 Eng Kuchli Natijalar' : 'Top 5 Best Results'}
              highlightName={participantName}
            />
          </div>
        </form>

        <div className="rounded-2xl border border-zinc-200/70 bg-white/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/70">
          {questions.length === 0 ? (
            <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-dashed border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              {activeLanguage === 'uz' ? 'Savollar shu yerda paydo bo`ladi.' : 'Generated questions will appear here.'}
            </div>
          ) : (
            <>
              <div className="space-y-5">
                {questions.map((question, index) => (
                  <article key={question.id} className="rounded-xl border border-zinc-200/70 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
                      {index + 1}. {question.type.toUpperCase()}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{question.prompt}</h3>

                    {question.type === 'mcq' && question.options ? (
                      <div className="mt-3 space-y-2">
                        {question.options.map((option) => (
                          <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm dark:bg-zinc-900">
                            <input
                              type="radio"
                              name={question.id}
                              checked={answers[question.id] === option}
                              onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option }))}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    ) : null}

                    {question.type === 'tf' ? (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: true }))}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-sm font-medium',
                            answers[question.id] === true
                              ? 'border-jade bg-jade/15 text-jade'
                              : 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200',
                          )}
                        >
                          {t('quiz.trueLabel')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: false }))}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-sm font-medium',
                            answers[question.id] === false
                              ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                              : 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200',
                          )}
                        >
                          {t('quiz.falseLabel')}
                        </button>
                      </div>
                    ) : null}

                    {question.type === 'short' ? (
                      <input
                        value={typeof answers[question.id] === 'string' ? (answers[question.id] as string) : ''}
                        onChange={(event) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: event.target.value,
                          }))
                        }
                        placeholder={t('quiz.answerPlaceholder')}
                        className="mt-3 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-jade/30 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
                      />
                    ) : null}
                  </article>
                ))}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  disabled={!canSubmit || isSubmitting}
                  onClick={() => void onSubmitQuiz()}
                  className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:enabled:hover:bg-zinc-200"
                >
                  {isSubmitting ? (activeLanguage === 'uz' ? 'Yuborilmoqda...' : 'Submitting...') : t('quiz.submit')}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
