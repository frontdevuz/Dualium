import { useTranslation } from 'react-i18next';

import { BrandLogo } from './BrandLogo';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-zinc-200/70 bg-white/70 py-10 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-950/70">
      <div className="mx-auto grid w-full max-w-[92rem] gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-3">
          <BrandLogo subtitle="Ancient Philosophy Atelier" />
          <p className="max-w-xl text-sm text-zinc-600 dark:text-zinc-300">{t('footer.text')}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            Copyright all reserved 2026 Izzatillo Davlatov
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Version 0.0.0.1</p>
        </div>

        <div className="rounded-2xl border border-zinc-200/70 bg-zinc-50/80 p-4 text-sm shadow-soft dark:border-zinc-700 dark:bg-zinc-900/60">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">Author</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
            {t('footer.studentLabel')}
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
            Izzatillo Davlatov
          </p>
          <a
            href="https://izzatillo.uz"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex text-sm font-semibold text-aurora transition hover:text-jade hover:underline"
          >
            izzatillo.uz
          </a>
        </div>
      </div>
    </footer>
  );
}
