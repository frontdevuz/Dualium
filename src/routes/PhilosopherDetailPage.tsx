import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { SeoMeta } from '../components/SeoMeta';
import {
  fetchArticles,
  fetchPhilosopherBySlug,
  getLocalizedArticleTitle,
  getLocalizedPhilosopherBio,
  getLocalizedPhilosopherIdeas,
} from '../lib/content';
import { getPhilosopherPortrait, getPhilosopherPortraitPosition } from '../lib/visuals';

export function PhilosopherDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith('uz') ? 'uz' : 'en';

  const { data: philosopher } = useQuery({
    queryKey: ['philosopher', slug],
    queryFn: () => fetchPhilosopherBySlug(slug ?? ''),
    enabled: Boolean(slug),
  });

  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });

  if (!philosopher) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-8 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
        {t('philosophers.notFound')}
      </div>
    );
  }

  const relatedArticles = articles.filter((article) => philosopher.relatedArticles.includes(article.slug));

  return (
    <>
      <SeoMeta
        title={`${philosopher.name} | Dualium`}
        description={getLocalizedPhilosopherBio(philosopher, language)}
        canonical={`https://dualium.vercel.app/philosophers/${philosopher.slug}`}
        ogTitle={`${philosopher.name} | Dualium`}
        ogDescription={getLocalizedPhilosopherBio(philosopher, language)}
        lang={language}
      />

      <section className="rounded-3xl border border-zinc-200/70 bg-white/80 p-6 shadow-soft sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-zinc-700/70">
            <img
              src={getPhilosopherPortrait(philosopher.slug)}
              alt={philosopher.name}
              className={`h-full min-h-[440px] w-full object-cover ${getPhilosopherPortraitPosition(philosopher.slug)}`}
              loading="lazy"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
            <p className="absolute left-3 bottom-3 text-sm font-semibold tracking-[0.08em] text-white/95">{philosopher.name}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{philosopher.era}</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">{philosopher.name}</h1>
            <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">{philosopher.school}</p>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
              {getLocalizedPhilosopherBio(philosopher, language)}
            </p>

            <div className="mt-6 rounded-2xl border border-amber-300/50 bg-amber-100/40 p-5 dark:border-amber-300/20 dark:bg-amber-400/10">
              <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-700 dark:text-zinc-100">
                {language === 'uz' ? 'Sitata' : 'Quote'}
              </h2>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-300">English</p>
              <p className="mt-1 text-sm italic text-zinc-700 dark:text-zinc-100">"{philosopher.quote_en}"</p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-300">O`zbekcha</p>
              <p className="mt-1 text-sm italic text-zinc-700 dark:text-zinc-100">"{philosopher.quote_uz}"</p>
              {philosopher.quote_source ? (
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{philosopher.quote_source}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200/70 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
              {t('article.keyTakeaways')}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              {getLocalizedPhilosopherIdeas(philosopher, language).map((idea) => (
                <li key={idea} className="rounded-lg bg-white px-3 py-2 dark:bg-zinc-900">
                  {idea}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200/70 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
              {t('philosophers.related')}
            </h2>
            <div className="mt-3 space-y-2">
              {relatedArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/learn/${article.slug}`}
                  className="block rounded-lg bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:text-jade dark:bg-zinc-900 dark:text-zinc-200"
                >
                  {getLocalizedArticleTitle(article, language)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
