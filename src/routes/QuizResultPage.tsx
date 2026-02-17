import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { LeaderboardPanel } from '../components/LeaderboardPanel';
import { SeoMeta } from '../components/SeoMeta';
import { SectionTitle } from '../components/SectionTitle';
import { explainWrongAnswer } from '../lib/explainQuiz';
import { sendQuizFeedback } from '../lib/feedbackClient';
import { fetchLeaderboard, formatLeaderboardDuration } from '../lib/leaderboardClient';
import { getLatestQuizAttempt, type StoredQuizAttempt } from '../lib/quizStorage';

function formatAnswer(value: string | boolean) {
  if (typeof value === 'boolean') {
    return String(value);
  }
  return value || '-';
}

function sourceToString(source: { articleSlug?: string; section?: string }) {
  return [source.articleSlug, source.section].filter(Boolean).join(' -> ') || 'unknown source';
}

const feedbackSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  feedback: z.string().trim().min(5).max(1500),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export function QuizResultPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith('uz') ? 'uz' : 'en';

  const result = getLatestQuizAttempt();
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [loadingById, setLoadingById] = useState<Record<string, boolean>>({});
  const [bulkLoading, setBulkLoading] = useState(false);
  const [feedbackState, setFeedbackState] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({
    type: 'idle',
    message: '',
  });

  const feedbackForm = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      feedback: '',
    },
  });

  const scorePercent = useMemo(() => {
    if (!result) {
      return 0;
    }

    if (result.total === 0) {
      return 0;
    }

    return Math.round((result.correctCount / result.total) * 100);
  }, [result]);

  const {
    data: leaderboardEntries = [],
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useQuery({
    queryKey: ['leaderboard', 'top5'],
    queryFn: () => fetchLeaderboard(5),
    refetchInterval: 60_000,
  });

  const explainOne = async (attempt: StoredQuizAttempt, qid: string) => {
    const wrongItem = attempt.wrong.find((item) => item.qid === qid);
    if (!wrongItem) {
      return;
    }

    if (explanations[qid]) {
      return;
    }

    setLoadingById((prev) => ({ ...prev, [qid]: true }));

    try {
      const text = await explainWrongAnswer({
        lang: attempt.lang,
        prompt: wrongItem.prompt,
        correctAnswer: wrongItem.correctAnswer,
        userAnswer: wrongItem.userAnswer,
        context: wrongItem.explanationContext ?? '',
        source: wrongItem.source,
      });

      setExplanations((prev) => ({ ...prev, [qid]: text }));
    } catch (error) {
      const fallback =
        attempt.lang === 'uz'
          ? `Izoh olib kelishda xatolik: ${error instanceof Error ? error.message : 'Noma`lum xato'}`
          : `Failed to generate explanation: ${error instanceof Error ? error.message : 'Unknown error'}`;

      setExplanations((prev) => ({ ...prev, [qid]: fallback }));
    } finally {
      setLoadingById((prev) => ({ ...prev, [qid]: false }));
    }
  };

  const explainTopMistakes = async (attempt: StoredQuizAttempt) => {
    const target = attempt.wrong.filter((item) => !explanations[item.qid]).slice(0, 3);
    if (target.length === 0 || bulkLoading) {
      return;
    }

    setBulkLoading(true);
    try {
      await Promise.all(target.map((item) => explainOne(attempt, item.qid)));
    } finally {
      setBulkLoading(false);
    }
  };

  const submitFeedback = feedbackForm.handleSubmit(async (values) => {
    if (!result) {
      return;
    }

    setFeedbackState({
      type: 'loading',
      message: result.lang === 'uz' ? 'Yuborilmoqda...' : 'Sending...',
    });

    try {
      await sendQuizFeedback({
        lang: result.lang,
        firstName: values.firstName,
        lastName: values.lastName,
        feedback: values.feedback,
        result: {
          scorePercent,
          correctCount: result.correctCount,
          total: result.total,
          wrongCount: result.wrong.length,
          createdAt: result.createdAt,
        },
      });

      feedbackForm.reset();
      setFeedbackState({
        type: 'success',
        message:
          result.lang === 'uz'
            ? 'Rahmat. Fikringiz muallifga yuborildi.'
            : 'Thanks. Your feedback was sent to the author.',
      });
    } catch (error) {
      setFeedbackState({
        type: 'error',
        message:
          result.lang === 'uz'
            ? `Yuborishda xatolik: ${error instanceof Error ? error.message : 'Noma`lum xato'}`
            : `Failed to send feedback: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  });

  if (!result) {
    return (
      <>
        <SeoMeta
          title={`${t('result.title')} | Dualium`}
          description={t('result.noResult')}
          canonical="https://dualium.vercel.app/quiz/result"
          ogTitle={`${t('result.title')} | Dualium`}
          ogDescription={t('result.noResult')}
          lang={language}
        />

        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-8 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
          <p>{t('result.noResult')}</p>
          <Link to="/quiz" className="mt-3 inline-flex font-semibold text-jade hover:underline">
            {t('common.quiz')} &rarr;
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SeoMeta
        title={`${t('result.title')} | Dualium`}
        description={`${t('result.score')}: ${scorePercent}%`}
        canonical="https://dualium.vercel.app/quiz/result"
        ogTitle={`${t('result.title')} | Dualium`}
        ogDescription={`${t('result.score')}: ${scorePercent}%`}
        lang={result.lang}
      />

      <SectionTitle title={t('result.title')} />

      <section className="rounded-2xl border border-zinc-200/70 bg-white/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200/70 bg-zinc-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{t('result.score')}</p>
            <p className="mt-1 text-2xl font-black text-zinc-900 dark:text-zinc-100">{scorePercent}%</p>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-zinc-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{t('result.correct')}</p>
            <p className="mt-1 text-2xl font-black text-jade">{result.correctCount}</p>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-zinc-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{t('result.incorrect')}</p>
            <p className="mt-1 text-2xl font-black text-rose-500">{result.wrong.length}</p>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-zinc-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
              {result.lang === 'uz' ? 'Yechish vaqti' : 'Completion Time'}
            </p>
            <p className="mt-1 text-lg font-black text-zinc-900 dark:text-zinc-100">
              {formatLeaderboardDuration(result.elapsedMs ?? 1000, result.lang)}
            </p>
            {result.participantName ? (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{result.participantName}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-6">
          <LeaderboardPanel
            lang={result.lang}
            entries={leaderboardEntries}
            isLoading={leaderboardLoading}
            errorMessage={leaderboardError instanceof Error ? leaderboardError.message : null}
            title={result.lang === 'uz' ? 'Top 5 Reyting (Online)' : 'Top 5 Leaderboard (Online)'}
            highlightName={result.participantName}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{t('result.review')}</h2>

          <button
            type="button"
            disabled={bulkLoading || result.wrong.length === 0}
            onClick={() => void explainTopMistakes(result)}
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition enabled:hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:enabled:hover:bg-zinc-800"
          >
            {result.lang === 'uz' ? 'Xatolarimni tushuntir (3 ta)' : 'Explain my mistakes (max 3)'}
          </button>
        </div>

        {result.wrong.length === 0 ? (
          <div className="mt-4 rounded-xl border border-jade/40 bg-jade/10 p-4 text-sm text-jade">
            {result.lang === 'uz' ? 'Ajoyib! Barcha savollarga togri javob berdingiz.' : 'Excellent. You answered all questions correctly.'}
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {result.wrong.map((item, index) => {
              const isLoading = Boolean(loadingById[item.qid]);
              const explanation = explanations[item.qid];

              return (
                <article key={item.qid} className="rounded-xl border border-rose-400/40 bg-rose-500/5 p-4 dark:border-rose-400/40 dark:bg-rose-500/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">Wrong #{index + 1}</p>
                  <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.prompt}</h3>

                  <div className="mt-3 grid gap-2 text-sm">
                    <p className="text-zinc-700 dark:text-zinc-200">
                      <span className="font-semibold">{t('result.yourAnswer')}:</span> {formatAnswer(item.userAnswer)}
                    </p>
                    <p className="text-zinc-700 dark:text-zinc-200">
                      <span className="font-semibold">{t('result.correctAnswer')}:</span> {formatAnswer(item.correctAnswer)}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Source: {sourceToString(item.source)}</p>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => void explainOne(result, item.qid)}
                      className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white transition enabled:hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:enabled:hover:bg-zinc-200"
                    >
                      {result.lang === 'uz' ? 'Dualium bilan tushuntir' : 'Explain with Dualium'}
                    </button>
                  </div>

                  {isLoading ? (
                    <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                      {result.lang === 'uz' ? 'Izoh yaratilmoqda...' : 'Generating explanation...'}
                    </p>
                  ) : null}

                  {explanation ? (
                    <div className="mt-3 rounded-lg border border-zinc-200 bg-white/80 p-3 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200">
                      {explanation}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-zinc-200/70 bg-zinc-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-950/50">
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
            {result.lang === 'uz' ? 'Muallifga fikr yuborish' : 'Send feedback to author'}
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {result.lang === 'uz'
              ? 'Ism, familiya va fikringizni yuboring. Quiz natijangiz ham birga jo`natiladi.'
              : 'Send your name and feedback. Your quiz result summary will be included.'}
          </p>

          <form onSubmit={submitFeedback} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-200">
                  {result.lang === 'uz' ? 'Ism' : 'First name'}
                </span>
                <input
                  type="text"
                  {...feedbackForm.register('firstName')}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none ring-jade/30 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
                />
                {feedbackForm.formState.errors.firstName ? (
                  <p className="mt-1 text-xs text-rose-500">
                    {result.lang === 'uz'
                      ? 'Ism kamida 2 ta belgi bo`lishi kerak.'
                      : 'First name must be at least 2 characters.'}
                  </p>
                ) : null}
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-200">
                  {result.lang === 'uz' ? 'Familiya' : 'Last name'}
                </span>
                <input
                  type="text"
                  {...feedbackForm.register('lastName')}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none ring-jade/30 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
                />
                {feedbackForm.formState.errors.lastName ? (
                  <p className="mt-1 text-xs text-rose-500">
                    {result.lang === 'uz'
                      ? 'Familiya kamida 2 ta belgi bo`lishi kerak.'
                      : 'Last name must be at least 2 characters.'}
                  </p>
                ) : null}
              </label>
            </div>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-zinc-700 dark:text-zinc-200">
                {result.lang === 'uz' ? 'Fikr-mulohaza' : 'Feedback'}
              </span>
              <textarea
                rows={4}
                {...feedbackForm.register('feedback')}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none ring-jade/30 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
              {feedbackForm.formState.errors.feedback ? (
                <p className="mt-1 text-xs text-rose-500">
                  {result.lang === 'uz'
                    ? 'Fikr kamida 5 ta belgi bo`lishi kerak.'
                    : 'Feedback must be at least 5 characters.'}
                </p>
              ) : null}
            </label>

            <button
              type="submit"
              disabled={feedbackState.type === 'loading'}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:enabled:hover:bg-zinc-200"
            >
              {feedbackState.type === 'loading'
                ? result.lang === 'uz'
                  ? 'Yuborilmoqda...'
                  : 'Sending...'
                : result.lang === 'uz'
                  ? 'Fikrni yuborish'
                  : 'Send feedback'}
            </button>
          </form>

          {feedbackState.type === 'success' ? (
            <p className="mt-3 text-sm text-jade">{feedbackState.message}</p>
          ) : null}
          {feedbackState.type === 'error' ? (
            <p className="mt-3 text-sm text-rose-500">{feedbackState.message}</p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/quiz"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {result.lang === 'uz' ? 'Yangi test' : 'New quiz'}
          </Link>
          <Link
            to="/learn"
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {t('common.startLearning')}
          </Link>
        </div>
      </section>
    </>
  );
}
