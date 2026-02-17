import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { SeoMeta } from '../components/SeoMeta';

export function NotFoundPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith('uz') ? 'uz' : 'en';

  return (
    <>
      <SeoMeta title={`404 | Dualium`} description={t('notFound.description')} lang={language} robots="noindex,nofollow" />

      <div className="rounded-3xl border border-zinc-200/70 bg-white/80 p-10 text-center shadow-soft dark:border-zinc-800 dark:bg-zinc-900/70">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">404</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-900 dark:text-zinc-100">{t('notFound.title')}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">{t('notFound.description')}</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {t('notFound.cta')}
        </Link>
      </div>
    </>
  );
}
