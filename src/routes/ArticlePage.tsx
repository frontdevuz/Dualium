import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { SeoMeta } from '../components/SeoMeta';
import {
  fetchArticleBySlug,
  getLocalizedArticleContent,
  getLocalizedArticleSummary,
  getLocalizedArticleTakeaways,
  getLocalizedArticleTitle,
} from '../lib/content';
import { cn } from '../lib/utils';
import { getArticleVisual } from '../lib/visuals';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();

  const language = i18n.resolvedLanguage?.startsWith('uz') ? 'uz' : 'en';

  const { data: article } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchArticleBySlug(slug ?? ''),
    enabled: Boolean(slug),
  });

  if (!article) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-8 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
        {t('article.notFound')}
      </div>
    );
  }

  const title = getLocalizedArticleTitle(article, language);
  const summary = getLocalizedArticleSummary(article, language);
  const content = getLocalizedArticleContent(article, language);
  const takeaways = getLocalizedArticleTakeaways(article, language);

  return (
    <>
      <SeoMeta
        title={`${title} | Dualium`}
        description={summary}
        canonical={`https://dualium.vercel.app/learn/${article.slug}`}
        ogTitle={title}
        ogDescription={summary}
        ogType="article"
        lang={language}
      />

      <section className="rounded-3xl border border-zinc-200/70 bg-white/80 p-6 shadow-soft sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{article.school}</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h1>
          </div>

          <div className="inline-flex rounded-full border border-zinc-300 p-1 dark:border-zinc-700">
            {(['en', 'uz'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => void i18n.changeLanguage(lang)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold transition',
                  language === lang
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800/70',
                )}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-zinc-700/70">
          <img
            src={getArticleVisual(article.slug)}
            alt={title}
            className="h-56 w-full object-cover sm:h-72"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="markdown rounded-2xl border border-zinc-200/70 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-950/40"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </motion.article>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-zinc-200/70 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">{t('article.summary')}</h2>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">{summary}</p>
            </div>

            <div className="rounded-2xl border border-zinc-200/70 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
                {t('article.keyTakeaways')}
              </h2>
              <ul className="mt-2 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                {takeaways.map((item) => (
                  <li key={item} className="rounded-lg bg-zinc-100/80 px-3 py-2 dark:bg-zinc-800/70">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to={`/quiz?scope=article&article=${article.slug}`}
              className="inline-flex w-full justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {t('common.testFromArticle')}
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
