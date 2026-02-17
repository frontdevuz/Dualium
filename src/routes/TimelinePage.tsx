import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { SeoMeta } from '../components/SeoMeta';
import { SectionTitle } from '../components/SectionTitle';
import { fetchArticles, fetchPhilosophers, getLocalizedArticleTitle } from '../lib/content';

type TimelineEvent = {
  id: string;
  year: number;
  region: 'east' | 'west';
  title: string;
  subtitle: string;
  kind: 'article' | 'philosopher' | 'milestone';
};

export function TimelinePage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith('uz') ? 'uz' : 'en';

  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });

  const { data: philosophers = [] } = useQuery({
    queryKey: ['philosophers'],
    queryFn: fetchPhilosophers,
  });

  const events = useMemo<TimelineEvent[]>(() => {
    const articleEvents = articles.map((article) => ({
      id: `article-${article.id}`,
      year: article.timelineYear,
      region: article.region,
      title: getLocalizedArticleTitle(article, language),
      subtitle: article.school,
      kind: 'article' as const,
    }));

    const philosopherEvents = philosophers.map((philosopher) => ({
      id: `philosopher-${philosopher.id}`,
      year: philosopher.timelineYear,
      region: philosopher.region,
      title: philosopher.name,
      subtitle: philosopher.school,
      kind: 'philosopher' as const,
    }));

    const westernArticleMilestones = articles
      .filter((article) => article.region === 'west')
      .flatMap((article) => {
        const articleTitle = getLocalizedArticleTitle(article, language);
        const takeaways = (language === 'uz' ? article.keyTakeaways_uz : article.keyTakeaways_en).slice(0, 2);

        return takeaways.map((takeaway, index) => ({
          id: `west-article-milestone-${article.id}-${index}`,
          year: article.timelineYear + index + 1,
          region: 'west' as const,
          title:
            language === 'uz'
              ? `${articleTitle} - Asosiy Nuqta ${index + 1}`
              : `${articleTitle} - Key Insight ${index + 1}`,
          subtitle: takeaway,
          kind: 'milestone' as const,
        }));
      });

    const westernPhilosopherMilestones = philosophers
      .filter((philosopher) => philosopher.region === 'west')
      .flatMap((philosopher) => {
        const idea = (language === 'uz' ? philosopher.keyIdeas_uz : philosopher.keyIdeas_en)[0];

        if (!idea) {
          return [];
        }

        return [
          {
            id: `west-philosopher-milestone-${philosopher.id}`,
            year: philosopher.timelineYear + 1,
            region: 'west' as const,
            title: language === 'uz' ? `${philosopher.name} - Asosiy Fikr` : `${philosopher.name} - Core Idea`,
            subtitle: idea,
            kind: 'milestone' as const,
          },
        ];
      });

    return [...articleEvents, ...philosopherEvents, ...westernArticleMilestones, ...westernPhilosopherMilestones].sort(
      (a, b) => a.year - b.year,
    );
  }, [articles, language, philosophers]);

  const eastEvents = events.filter((event) => event.region === 'east');
  const westEvents = events.filter((event) => event.region === 'west');

  return (
    <>
      <SeoMeta
        title={`${t('timeline.title')} | Dualium`}
        description={t('timeline.subtitle')}
        canonical="https://dualium.vercel.app/timeline"
        ogTitle={`${t('timeline.title')} | Dualium`}
        ogDescription={t('timeline.subtitle')}
        lang={language}
      />

      <SectionTitle title={t('timeline.title')} description={t('timeline.subtitle')} />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200/70 bg-white/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/70">
          <h2 className="mb-1 text-lg font-bold text-jade">
            {t('timeline.eastTrack')}
            <span className="ml-2 rounded-full border border-jade/30 bg-jade/10 px-2 py-0.5 text-xs font-semibold text-jade">
              {eastEvents.length}
            </span>
          </h2>
          <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
            {language === 'uz'
              ? 'Sharq yo`nalishida maqolalar va faylasuflar tarixiy tartibda.'
              : 'Articles and philosophers from the Eastern tradition in chronological order.'}
          </p>
          <div className="content-auto relative max-h-[68vh] space-y-4 overflow-y-auto pr-2 pl-5 before:absolute before:top-0 before:left-1 before:h-full before:w-0.5 before:bg-jade/40">
            {eastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="effect-card relative rounded-xl border border-zinc-200/70 bg-zinc-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-950/50"
              >
                <span className="absolute -left-[22px] top-4 h-3 w-3 rounded-full bg-jade ring-4 ring-jade/20" />
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{event.year}</p>
                <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{event.title}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  {event.subtitle} ·{' '}
                  {event.kind === 'article'
                    ? language === 'uz'
                      ? 'Maqola'
                      : 'Article'
                    : event.kind === 'philosopher'
                      ? language === 'uz'
                        ? 'Faylasuf'
                        : 'Philosopher'
                      : language === 'uz'
                        ? 'Milestone'
                        : 'Milestone'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/70 bg-white/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/70">
          <h2 className="mb-1 text-lg font-bold text-bronze">
            {t('timeline.westTrack')}
            <span className="ml-2 rounded-full border border-bronze/40 bg-bronze/10 px-2 py-0.5 text-xs font-semibold text-bronze">
              {westEvents.length}
            </span>
          </h2>
          <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
            {language === 'uz'
              ? 'Kengaytirilgan G`arb yo`nalishi: maqolalar, faylasuflar va qo`shimcha milestone nuqtalar.'
              : 'Expanded Western track with articles, philosophers, and added milestone points.'}
          </p>
          <div className="content-auto relative max-h-[68vh] space-y-4 overflow-y-auto pr-2 pl-5 before:absolute before:top-0 before:left-1 before:h-full before:w-0.5 before:bg-bronze/40">
            {westEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="effect-card relative rounded-xl border border-zinc-200/70 bg-zinc-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-950/50"
              >
                <span className="absolute -left-[22px] top-4 h-3 w-3 rounded-full bg-bronze ring-4 ring-bronze/20" />
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{event.year}</p>
                <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{event.title}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300">
                  {event.subtitle} ·{' '}
                  {event.kind === 'article'
                    ? language === 'uz'
                      ? 'Maqola'
                      : 'Article'
                    : event.kind === 'philosopher'
                      ? language === 'uz'
                        ? 'Faylasuf'
                        : 'Philosopher'
                      : language === 'uz'
                        ? 'Milestone'
                        : 'Milestone'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
