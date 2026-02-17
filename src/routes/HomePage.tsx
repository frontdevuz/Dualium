import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { BrandLogo } from '../components/BrandLogo';
import { LiveVisualShowcase } from '../components/LiveVisualShowcase';
import { SeoMeta } from '../components/SeoMeta';
import { SectionTitle } from '../components/SectionTitle';
import {
  fetchArticles,
  fetchPhilosophers,
  getLocalizedArticleTakeaways,
  getLocalizedArticleSummary,
  getLocalizedArticleTitle,
  getLocalizedPhilosopherBio,
  getLocalizedPhilosopherQuote,
} from '../lib/content';
import { getArticleVisual, getPhilosopherPortrait, getPhilosopherPortraitPosition } from '../lib/visuals';

const FEATURED_PRIORITY = [
  'al-farabi',
  'ibn-sina',
  'al-biruni',
  'al-khwarizmi',
  'alisher-navoi',
  'al-maturidi',
  'ulugh-beg',
  'rumi',
];

const QUOTE_ROTATION_MS = 5 * 60 * 1000;
const QUOTE_WINDOW_SIZE = 12;
const QUOTE_STEP = 4;

const CREATOR_QUOTE = {
  id: 'creator-izzatillo-davlatov',
  slug: 'creator-izzatillo-davlatov',
  name: 'Izzatillo Davlatov',
  school_en: 'Creator Quote',
  school_uz: 'Muallif Sitatasi',
  quote_en: "If you want to do something, do it, if you don't succeed, don't give up, you will succeed!",
  quote_uz:
    "Agar biror ish qilmoqchi bo'lsang, qil. Agar birinchi urinishda bo'lmasa, taslim bo'lma, albatta muvaffaqiyatga erishasan!",
  quote_source: 'Izzatillo Davlatov',
};

export function HomePage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith('uz') ? 'uz' : 'en';
  const [quoteOffset, setQuoteOffset] = useState(0);

  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });

  const { data: philosophers = [] } = useQuery({
    queryKey: ['philosophers'],
    queryFn: fetchPhilosophers,
  });

  const eastArticles = useMemo(() => articles.filter((article) => article.region === 'east').slice(0, 3), [articles]);
  const westArticles = useMemo(() => articles.filter((article) => article.region === 'west').slice(0, 3), [articles]);
  const featuredPhilosophers = useMemo(() => {
    const lookup = new Map(philosophers.map((item) => [item.slug, item]));
    const prioritized = FEATURED_PRIORITY.map((slug) => lookup.get(slug)).filter(
      (item): item is (typeof philosophers)[number] => Boolean(item),
    );
    const used = new Set(prioritized.map((item) => item.slug));
    const fallback = philosophers.filter((item) => !used.has(item.slug));
    return [...prioritized, ...fallback].slice(0, 8);
  }, [philosophers]);
  const orderedQuotePool = useMemo(() => {
    const used = new Set(featuredPhilosophers.map((item) => item.slug));
    const remaining = philosophers.filter((item) => !used.has(item.slug));
    return [...featuredPhilosophers, ...remaining];
  }, [featuredPhilosophers, philosophers]);

  const quoteShowcase = useMemo(() => {
    if (orderedQuotePool.length === 0) {
      return [];
    }

    const start = ((quoteOffset % orderedQuotePool.length) + orderedQuotePool.length) % orderedQuotePool.length;
    const size = Math.min(QUOTE_WINDOW_SIZE, orderedQuotePool.length);

    return Array.from({ length: size }, (_, index) => orderedQuotePool[(start + index) % orderedQuotePool.length]);
  }, [orderedQuotePool, quoteOffset]);

  useEffect(() => {
    if (orderedQuotePool.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setQuoteOffset((prev) => prev + QUOTE_STEP);
    }, QUOTE_ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [orderedQuotePool.length]);

  return (
    <>
      <SeoMeta lang={language} />

      <section className="relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/80 p-6 shadow-aura sm:p-10 dark:border-zinc-700/80 dark:bg-zinc-900/70">
        <div className="absolute -top-16 -right-12 h-56 w-56 rounded-full bg-ember/35 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-aurora/35 blur-3xl" />
        <div className="absolute inset-0 bg-hero-radial opacity-80" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.26)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.26)_1px,transparent_1px)] [background-size:28px_28px] dark:opacity-10" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative"
        >
          <BrandLogo
            className="mb-5"
            subtitle="By Izzatillo Davlatov"
            titleClassName="text-5xl sm:text-6xl"
            subtitleClassName="text-xs tracking-[0.2em]"
            iconClassName="h-12 w-12 sm:h-14 sm:w-14"
          />

          <h1 className="max-w-4xl font-display text-5xl leading-none tracking-wide text-zinc-950 sm:text-7xl dark:text-white">
            {t('hero.title')}
          </h1>
          <p className="mt-5 max-w-2xl text-base text-zinc-700 dark:text-zinc-300">{t('hero.subtitle')}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/learn"
              className="rounded-full bg-gradient-to-r from-zinc-900 to-velvet px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:from-zinc-100 dark:to-zinc-300 dark:text-zinc-900"
            >
              {t('common.startLearning')}
            </Link>
            <Link
              to="/quiz"
              className="rounded-full border border-zinc-300 bg-white/90 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              {t('common.takeQuiz')}
            </Link>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-300/70 bg-zinc-50/80 px-4 py-2 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-aurora" />
            <a href="https://izzatillo.uz" target="_blank" rel="noreferrer" className="font-semibold hover:text-aurora hover:underline">
              Designed by Izzatillo Davlatov · izzatillo.uz
            </a>
          </div>
        </motion.div>
      </section>
      <LiveVisualShowcase language={language} />

      <section className="mt-16">
        <SectionTitle title={t('home.eastTitle')} />
        <div className="grid gap-4 md:grid-cols-3">
          {eastArticles.map((article) => (
            <Link
              key={article.id}
              to={`/learn/${article.slug}`}
              className="group rounded-2xl border border-zinc-200/70 bg-white/85 p-5 transition hover:-translate-y-1 hover:shadow-aura dark:border-zinc-800 dark:bg-zinc-900/75"
            >
              <div className="relative mb-4 overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-700/70">
                <img
                  src={getArticleVisual(article.slug)}
                  alt={getLocalizedArticleTitle(article, language)}
                  className="h-40 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/45 via-transparent to-transparent" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-aurora">{article.school}</p>
              <h3 className="mt-2 font-display text-3xl leading-none tracking-wide text-zinc-900 dark:text-zinc-100">
                {getLocalizedArticleTitle(article, language)}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">
                {getLocalizedArticleSummary(article, language)}
              </p>
              <ul className="mt-3 space-y-1">
                {getLocalizedArticleTakeaways(article, language)
                  .slice(0, 2)
                  .map((point) => (
                    <li key={point} className="text-xs text-zinc-500 dark:text-zinc-400">
                      - {point}
                    </li>
                  ))}
              </ul>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 transition group-hover:text-aurora">
                Read Insight
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle title={t('home.westTitle')} />
        <div className="grid gap-4 md:grid-cols-3">
          {westArticles.map((article) => (
            <Link
              key={article.id}
              to={`/learn/${article.slug}`}
              className="group rounded-2xl border border-zinc-200/70 bg-white/85 p-5 transition hover:-translate-y-1 hover:shadow-aura dark:border-zinc-800 dark:bg-zinc-900/75"
            >
              <div className="relative mb-4 overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-700/70">
                <img
                  src={getArticleVisual(article.slug)}
                  alt={getLocalizedArticleTitle(article, language)}
                  className="h-40 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/45 via-transparent to-transparent" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ember">{article.school}</p>
              <h3 className="mt-2 font-display text-3xl leading-none tracking-wide text-zinc-900 dark:text-zinc-100">
                {getLocalizedArticleTitle(article, language)}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">
                {getLocalizedArticleSummary(article, language)}
              </p>
              <ul className="mt-3 space-y-1">
                {getLocalizedArticleTakeaways(article, language)
                  .slice(0, 2)
                  .map((point) => (
                    <li key={point} className="text-xs text-zinc-500 dark:text-zinc-400">
                      - {point}
                    </li>
                  ))}
              </ul>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 transition group-hover:text-ember">
                Read Insight
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle title={t('home.featuredTitle')} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPhilosophers.map((philosopher) => (
            <Link
              key={philosopher.id}
              to={`/philosophers/${philosopher.slug}`}
              className="rounded-2xl border border-zinc-200/70 bg-white/85 p-5 transition hover:-translate-y-1 hover:shadow-aura dark:border-zinc-800 dark:bg-zinc-900/75"
            >
              <div className="relative mb-4 overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-700/70">
                <img
                  src={getPhilosopherPortrait(philosopher.slug)}
                  alt={philosopher.name}
                  className={`h-56 w-full object-cover ${getPhilosopherPortraitPosition(philosopher.slug)}`}
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                {philosopher.era}
              </p>
              <h3 className="mt-2 font-display text-3xl leading-none tracking-wide text-zinc-900 dark:text-zinc-100">
                {philosopher.name}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">
                {getLocalizedPhilosopherBio(philosopher, language)}
              </p>
              <blockquote className="mt-3 rounded-lg border border-amber-300/40 bg-amber-100/35 px-3 py-2 text-xs italic text-zinc-700 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-zinc-200">
                "{getLocalizedPhilosopherQuote(philosopher, language)}"
              </blockquote>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-zinc-200/70 bg-white/82 p-6 shadow-soft dark:border-zinc-800 dark:bg-zinc-900/72">
        <SectionTitle
          title={language === 'uz' ? 'Sitatalar Galereyasi' : 'Quote Gallery'}
          description={
            language === 'uz'
              ? 'Har 5 daqiqada yangi faylasuf sitatalari bilan yangilanadi. Inglizcha va ozbekcha variantlar birga beriladi.'
              : 'Updates every 5 minutes with fresh philosopher quotes in both English and Uzbek.'
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-amber-300/50 bg-amber-100/55 p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-aura dark:border-amber-300/30 dark:bg-amber-500/10">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/60 bg-white/85 text-2xl font-black text-zinc-800 dark:border-amber-300/40 dark:bg-zinc-900 dark:text-zinc-100">
                ?
              </div>
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{CREATOR_QUOTE.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {language === 'uz' ? CREATOR_QUOTE.school_uz : CREATOR_QUOTE.school_en}
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">English</p>
              <blockquote className="rounded-lg border border-zinc-300/70 bg-white/90 px-3 py-2 text-xs italic text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950/70 dark:text-zinc-200">
                "{CREATOR_QUOTE.quote_en}"
              </blockquote>

              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">O`zbekcha</p>
              <blockquote className="rounded-lg border border-amber-300/40 bg-amber-100/35 px-3 py-2 text-xs italic text-zinc-700 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-zinc-200">
                "{CREATOR_QUOTE.quote_uz}"
              </blockquote>
            </div>

            <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">{CREATOR_QUOTE.quote_source}</p>
          </article>

          {quoteShowcase.map((philosopher) => (
            <article
              key={philosopher.slug}
              className="rounded-2xl border border-zinc-200/70 bg-zinc-50/85 p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-zinc-700 dark:bg-zinc-900/80"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getPhilosopherPortrait(philosopher.slug)}
                  alt={philosopher.name}
                  className={`h-14 w-14 rounded-full border border-zinc-300/70 object-cover ${getPhilosopherPortraitPosition(
                    philosopher.slug,
                  )} dark:border-zinc-700`}
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">{philosopher.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{philosopher.school}</p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">English</p>
                <blockquote className="rounded-lg border border-zinc-300/70 bg-white/90 px-3 py-2 text-xs italic text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950/70 dark:text-zinc-200">
                  "{philosopher.quote_en}"
                </blockquote>

                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">O`zbekcha</p>
                <blockquote className="rounded-lg border border-amber-300/40 bg-amber-100/35 px-3 py-2 text-xs italic text-zinc-700 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-zinc-200">
                  "{philosopher.quote_uz}"
                </blockquote>
              </div>

              {philosopher.quote_source ? (
                <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">{philosopher.quote_source}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-zinc-200/70 bg-white/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/75">
        <SectionTitle title={t('home.timelinePreview')} description={t('home.timelineHint')} />
        <div className="grid gap-3 md:grid-cols-2">
          {articles
            .slice()
            .sort((a, b) => a.timelineYear - b.timelineYear)
            .slice(0, 6)
            .map((article) => (
              <div key={article.id} className="rounded-xl border border-zinc-200/70 bg-zinc-50/90 p-4 dark:border-zinc-700 dark:bg-zinc-900/80">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                  {article.timelineYear}
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {getLocalizedArticleTitle(article, language)}
                </p>
              </div>
            ))}
        </div>
        <Link to="/timeline" className="mt-6 inline-flex text-sm font-semibold text-aurora hover:underline">
          {t('common.timeline')} &rarr;
        </Link>
      </section>
    </>
  );
}
