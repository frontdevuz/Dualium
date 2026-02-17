import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { SeoMeta } from '../components/SeoMeta';
import { SectionTitle } from '../components/SectionTitle';
import {
  fetchArticles,
  fetchConcepts,
  fetchPhilosophers,
  getLocalizedArticleSummary,
  getLocalizedArticleTitle,
  getLocalizedPhilosopherBio,
  getLocalizedPhilosopherIdeas,
} from '../lib/content';
import { getArticleVisual, getPhilosopherPortrait, getPhilosopherPortraitPosition } from '../lib/visuals';

type SearchKind = 'article' | 'philosopher' | 'concept' | 'creator';
type SearchFilter = 'all' | SearchKind;

type SearchHit = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  snippet: string;
  href: string;
  score: number;
  visual?: string;
  external?: boolean;
};

function tokenize(query: string) {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04FF\u00C0-\u024F\s-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

function cleanText(input: string) {
  return input
    .replace(/[#*_`>[\]\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreField(text: string, tokens: string[], weight: number) {
  if (!text || tokens.length === 0) {
    return 0;
  }

  const normalized = text.toLowerCase();
  let matched = 0;

  for (const token of tokens) {
    if (normalized.includes(token)) {
      matched += 1;
    }
  }

  return matched * weight;
}

function scoreNormalizedField(normalizedText: string, tokens: string[], weight: number) {
  if (!normalizedText || tokens.length === 0) {
    return 0;
  }

  let matched = 0;

  for (const token of tokens) {
    if (normalizedText.includes(token)) {
      matched += 1;
    }
  }

  return matched * weight;
}

function buildSnippet(text: string, tokens: string[], maxLength = 180) {
  if (!text) {
    return '';
  }

  const normalized = text.toLowerCase();
  const firstToken = tokens.find((token) => normalized.includes(token));
  if (!firstToken) {
    return text.slice(0, maxLength).trim();
  }

  const index = normalized.indexOf(firstToken);
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, start + maxLength);
  const prefix = start > 0 ? '... ' : '';
  const suffix = end < text.length ? ' ...' : '';

  return `${prefix}${text.slice(start, end).trim()}${suffix}`;
}

function createHighlightRenderer(tokens: string[]) {
  if (!tokens.length) {
    return (text: string) => text;
  }

  const normalizedTokenSet = new Set(tokens.map((token) => token.toLowerCase()));
  const pattern = tokens
    .filter((token) => token.length > 0)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  if (!pattern) {
    return (text: string) => text;
  }

  const regex = new RegExp(`(${pattern})`, 'gi');

  return (text: string) => {
    if (!text) {
      return text;
    }

    const parts = text.split(regex);
    return parts.map((part, index) => {
      const isMatch = normalizedTokenSet.has(part.toLowerCase());
      return isMatch ? (
        <mark key={`${part}-${index}`} className="rounded bg-amber-200/70 px-0.5 text-zinc-900 dark:bg-amber-400/40 dark:text-zinc-100">
          {part}
        </mark>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      );
    });
  };
}

export function SearchPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith('uz') ? 'uz' : 'en';
  const location = useLocation();

  const query = useMemo(() => new URLSearchParams(location.search).get('q')?.trim() ?? '', [location.search]);
  const tokens = useMemo(() => tokenize(query), [query]);
  const highlightText = useMemo(() => createHighlightRenderer(tokens), [tokens]);
  const [filter, setFilter] = useState<SearchFilter>('all');

  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });

  const { data: philosophers = [] } = useQuery({
    queryKey: ['philosophers'],
    queryFn: fetchPhilosophers,
  });

  const { data: concepts = [] } = useQuery({
    queryKey: ['concepts'],
    queryFn: fetchConcepts,
  });

  useEffect(() => {
    setFilter('all');
  }, [query]);

  const conceptNameBySlug = useMemo(() => {
    return new Map(concepts.map((concept) => [concept.slug, language === 'uz' ? concept.name_uz : concept.name_en]));
  }, [concepts, language]);

  const articleIndex = useMemo(() => {
    return articles.map((article) => {
      const title = getLocalizedArticleTitle(article, language);
      const summary = getLocalizedArticleSummary(article, language);
      const takeaways = (language === 'uz' ? article.keyTakeaways_uz : article.keyTakeaways_en).join(' ');
      const content = cleanText(language === 'uz' ? article.content_uz : article.content_en);
      const conceptNames = article.concepts.map((slug) => conceptNameBySlug.get(slug) ?? slug).join(' ');

      return {
        article,
        title,
        summary,
        takeaways,
        content,
        conceptNames,
        titleNorm: title.toLowerCase(),
        summaryNorm: summary.toLowerCase(),
        schoolNorm: article.school.toLowerCase(),
        takeawaysNorm: takeaways.toLowerCase(),
        contentNorm: content.toLowerCase(),
        conceptsNorm: conceptNames.toLowerCase(),
        snippetSource: `${summary} ${takeaways} ${content}`,
      };
    });
  }, [articles, conceptNameBySlug, language]);

  const philosopherIndex = useMemo(() => {
    return philosophers.map((philosopher) => {
      const bio = getLocalizedPhilosopherBio(philosopher, language);
      const ideas = getLocalizedPhilosopherIdeas(philosopher, language).join(' ');
      const quoteText = `${philosopher.quote_en} ${philosopher.quote_uz}`;

      return {
        philosopher,
        bio,
        ideas,
        quoteText,
        nameNorm: philosopher.name.toLowerCase(),
        schoolNorm: philosopher.school.toLowerCase(),
        quoteNorm: quoteText.toLowerCase(),
        bioNorm: bio.toLowerCase(),
        ideasNorm: ideas.toLowerCase(),
        eraNorm: philosopher.era.toLowerCase(),
        snippetSource: `${bio} ${ideas} ${quoteText}`,
      };
    });
  }, [language, philosophers]);

  const conceptIndex = useMemo(() => {
    return concepts.map((concept) => {
      const name = language === 'uz' ? concept.name_uz : concept.name_en;

      return {
        concept,
        name,
        nameNorm: name.toLowerCase(),
        slugNorm: concept.slug.toLowerCase(),
        regionNorm: concept.region.toLowerCase(),
      };
    });
  }, [concepts, language]);

  const hits = useMemo<SearchHit[]>(() => {
    if (tokens.length === 0) {
      return [];
    }

    const creatorProfileTextEn =
      'Front-end developer from Uzbekistan, passionate about technology and preparing to study cyber security. 1 year of experience in Front-End Development. Official website: izzatillo.uz.';
    const creatorProfileTextUz =
      'O`zbekistondan Front-end dasturchi. Texnologiyaga qiziqadi va cyber security yo`nalishida o`qishga tayyorlanmoqda. Front-End Development bo`yicha 1 yillik tajriba. Rasmiy sayt: izzatillo.uz.';
    const creatorCorpus =
      'izzatillo davlatov dav izzatillo.uz creator author frontend front-end developer uzbekistan cyber security dualium';
    const creatorScore = scoreField(creatorCorpus, tokens, 18);

    const articleHits = articleIndex
      .map<SearchHit | null>((item) => {
        const score =
          scoreNormalizedField(item.titleNorm, tokens, 13) +
          scoreNormalizedField(item.summaryNorm, tokens, 9) +
          scoreNormalizedField(item.schoolNorm, tokens, 6) +
          scoreNormalizedField(item.takeawaysNorm, tokens, 6) +
          scoreNormalizedField(item.contentNorm, tokens, 3) +
          scoreNormalizedField(item.conceptsNorm, tokens, 5);

        if (score <= 0) {
          return null;
        }

        return {
          id: `article-${item.article.id}`,
          kind: 'article',
          title: item.title,
          subtitle: `${item.article.school} · ${t('common.readingTime', { minutes: item.article.readingTime })}`,
          snippet: buildSnippet(item.snippetSource, tokens),
          href: `/learn/${item.article.slug}`,
          score,
          visual: getArticleVisual(item.article.slug),
        };
      })
      .filter((item): item is SearchHit => Boolean(item));

    const philosopherHits = philosopherIndex
      .map<SearchHit | null>((item) => {
        const score =
          scoreNormalizedField(item.nameNorm, tokens, 14) +
          scoreNormalizedField(item.schoolNorm, tokens, 8) +
          scoreNormalizedField(item.quoteNorm, tokens, 7) +
          scoreNormalizedField(item.bioNorm, tokens, 6) +
          scoreNormalizedField(item.ideasNorm, tokens, 6) +
          scoreNormalizedField(item.eraNorm, tokens, 2);

        if (score <= 0) {
          return null;
        }

        return {
          id: `philosopher-${item.philosopher.id}`,
          kind: 'philosopher',
          title: item.philosopher.name,
          subtitle: `${item.philosopher.school} · ${item.philosopher.era}`,
          snippet: buildSnippet(item.snippetSource, tokens),
          href: `/philosophers/${item.philosopher.slug}`,
          score,
          visual: getPhilosopherPortrait(item.philosopher.slug),
        };
      })
      .filter((item): item is SearchHit => Boolean(item));

    const conceptHits = conceptIndex
      .map<SearchHit | null>((item) => {
        const score =
          scoreNormalizedField(item.nameNorm, tokens, 9) +
          scoreNormalizedField(item.slugNorm, tokens, 6) +
          scoreNormalizedField(item.regionNorm, tokens, 2);

        if (score <= 0) {
          return null;
        }

        return {
          id: `concept-${item.concept.id}`,
          kind: 'concept',
          title: item.name,
          subtitle: `${t('search.concepts')} · ${item.concept.region}`,
          snippet:
            language === 'uz'
              ? `Ushbu konsept asosida maqolalarni filtrlab o'qishingiz mumkin.`
              : `Use this concept to filter relevant learning articles.`,
          href: `/learn?concept=${encodeURIComponent(item.concept.slug)}`,
          score,
        };
      })
      .filter((item): item is SearchHit => Boolean(item));

    const creatorHit: SearchHit[] =
      creatorScore > 0
        ? [
            {
              id: 'creator-izzatillo-davlatov',
              kind: 'creator',
              title: 'Izzatillo Davlatov',
              subtitle:
                language === 'uz'
                  ? 'Dualium muallifi · Front-End Developer'
                  : 'Dualium Author · Front-End Developer',
              snippet: language === 'uz' ? creatorProfileTextUz : creatorProfileTextEn,
              href: 'https://izzatillo.uz',
              score: creatorScore + 80,
              visual: '/dualium-logo.svg',
              external: true,
            },
          ]
        : [];

    return [...creatorHit, ...articleHits, ...philosopherHits, ...conceptHits].sort((a, b) => b.score - a.score).slice(0, 80);
  }, [articleIndex, conceptIndex, language, philosopherIndex, t, tokens]);

  const filteredHits = useMemo(() => {
    if (filter === 'all') {
      return hits;
    }
    return hits.filter((hit) => hit.kind === filter);
  }, [filter, hits]);

  const articleCount = hits.filter((hit) => hit.kind === 'article').length;
  const philosopherCount = hits.filter((hit) => hit.kind === 'philosopher').length;
  const conceptCount = hits.filter((hit) => hit.kind === 'concept').length;
  const creatorCount = hits.filter((hit) => hit.kind === 'creator').length;

  return (
    <>
      <SeoMeta
        title={`${t('search.title')} | Dualium`}
        description={t('search.subtitle')}
        canonical="https://dualium.vercel.app/search"
        ogTitle={`${t('search.title')} | Dualium`}
        ogDescription={t('search.subtitle')}
        lang={language}
      />

      <SectionTitle
        title={t('search.title')}
        description={query ? `${t('search.resultLabel', { count: filteredHits.length })} • "${query}"` : t('search.subtitle')}
      />

      {tokens.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/75 p-8 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-400">
          {t('search.emptyQuery')}
        </div>
      ) : hits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/75 p-8 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-400">
          {t('search.emptyResult')}
        </div>
      ) : (
        <section className="content-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                filter === 'all'
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
              }`}
            >
              All ({hits.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('article')}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                filter === 'article'
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
              }`}
            >
              {t('search.articles')} ({articleCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('philosopher')}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                filter === 'philosopher'
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
              }`}
            >
              {t('search.philosophers')} ({philosopherCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('concept')}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                filter === 'concept'
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
              }`}
            >
              {t('search.concepts')} ({conceptCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('creator')}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                filter === 'creator'
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
              }`}
            >
              {t('search.creator')} ({creatorCount})
            </button>
          </div>

          <div className="content-auto space-y-3">
            {filteredHits.map((hit) => {
              const isExternal = hit.external || hit.href.startsWith('http://') || hit.href.startsWith('https://');
              const cardClassName =
                'group grid gap-3 rounded-2xl border border-zinc-200/70 bg-white/85 p-4 transition hover:-translate-y-0.5 hover:shadow-soft md:grid-cols-[140px_1fr] dark:border-zinc-800 dark:bg-zinc-900/70';

              const cardContent = (
                <>
                  {hit.visual ? (
                    <div className="overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-700/70">
                      <img
                        src={hit.visual}
                        alt={hit.title}
                        className={`h-24 w-full md:h-full ${
                          hit.kind === 'creator'
                            ? 'bg-zinc-50 p-2 object-contain dark:bg-zinc-900'
                            : `object-cover ${
                                hit.kind === 'philosopher' ? getPhilosopherPortraitPosition(hit.href.split('/').pop() ?? '') : ''
                              }`
                        }`}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-xl border border-zinc-200/70 bg-zinc-100 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {hit.kind}
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{hit.subtitle}</p>
                    <h3 className="mt-1 text-lg font-semibold text-zinc-900 transition group-hover:text-jade dark:text-zinc-100">
                      {highlightText(hit.title)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{highlightText(hit.snippet)}</p>
                  </div>
                </>
              );

              if (isExternal) {
                return (
                  <a
                    key={hit.id}
                    href={hit.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cardClassName}
                  >
                    {cardContent}
                  </a>
                );
              }

              return (
                <Link key={hit.id} to={hit.href} className={cardClassName}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
