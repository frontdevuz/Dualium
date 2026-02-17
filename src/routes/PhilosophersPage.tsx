import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { SeoMeta } from '../components/SeoMeta';
import { SectionTitle } from '../components/SectionTitle';
import { fetchPhilosophers, getLocalizedPhilosopherBio, getLocalizedPhilosopherIdeas } from '../lib/content';
import { getPhilosopherPortrait, getPhilosopherPortraitPosition } from '../lib/visuals';

export function PhilosophersPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith('uz') ? 'uz' : 'en';

  const { data: philosophers = [] } = useQuery({
    queryKey: ['philosophers'],
    queryFn: fetchPhilosophers,
  });

  return (
    <>
      <SeoMeta
        title={`${t('philosophers.title')} | Dualium`}
        description={t('philosophers.subtitle')}
        canonical="https://dualium.vercel.app/philosophers"
        ogTitle={`${t('philosophers.title')} | Dualium`}
        ogDescription={t('philosophers.subtitle')}
        lang={language}
      />

      <SectionTitle title={t('philosophers.title')} description={t('philosophers.subtitle')} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {philosophers.map((philosopher) => (
          <article
            key={philosopher.id}
            className="rounded-2xl border border-zinc-200/70 bg-white/80 p-5 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-zinc-800 dark:bg-zinc-900/70"
          >
            <div className="relative mb-4 overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-700/70">
              <img
                src={getPhilosopherPortrait(philosopher.slug)}
                alt={philosopher.name}
                className={`h-56 w-full object-cover ${getPhilosopherPortraitPosition(philosopher.slug)}`}
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
              <p className="absolute left-3 bottom-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/90">{philosopher.school}</p>
            </div>

            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{philosopher.era}</p>
              <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
                {philosopher.region === 'east' ? t('common.east') : t('common.west')}
              </span>
            </div>

            <h2 className="mt-3 text-xl font-bold text-zinc-900 dark:text-zinc-100">{philosopher.name}</h2>
            <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">{philosopher.school}</p>

            <p className="mt-3 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">
              {getLocalizedPhilosopherBio(philosopher, language)}
            </p>

            <div className="mt-3 rounded-xl border border-zinc-200/70 bg-zinc-50/85 p-3 dark:border-zinc-700 dark:bg-zinc-900/70">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                {language === 'uz' ? 'Sitata' : 'Quote'}
              </p>
              <blockquote className="mt-1 rounded-lg border border-zinc-300/70 bg-white/90 px-3 py-2 text-xs italic text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950/70 dark:text-zinc-200">
                "{philosopher.quote_en}"
              </blockquote>
              <blockquote className="mt-2 rounded-lg border border-amber-300/40 bg-amber-100/35 px-3 py-2 text-xs italic text-zinc-700 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-zinc-200">
                "{philosopher.quote_uz}"
              </blockquote>
              {philosopher.quote_source ? (
                <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">{philosopher.quote_source}</p>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {getLocalizedPhilosopherIdeas(philosopher, language)
                .slice(0, 3)
                .map((idea) => (
                  <span
                    key={idea}
                    className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                  >
                    {idea}
                  </span>
                ))}
            </div>

            <Link to={`/philosophers/${philosopher.slug}`} className="mt-4 inline-flex text-sm font-semibold text-jade hover:underline">
              {t('philosophers.details')} &rarr;
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
