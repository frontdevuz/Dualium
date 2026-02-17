import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { useState } from 'react';

import { AppErrorBoundary } from './components/AppErrorBoundary';
import { DualiumChatWidget } from './components/DualiumChatWidget';
import { ScrollTopButton } from './components/ScrollTopButton';
import { WelcomeVoice } from './components/WelcomeVoice';
import { ThemeProvider } from './context/ThemeContext';
import type { Article, Philosopher } from './data';
import { AppRouter } from './routes/AppRouter';
import type { DualiumLang } from './lib/aiClient';

const STOP_WORDS = new Set([
  'and',
  'the',
  'for',
  'with',
  'about',
  'what',
  'which',
  'from',
  'this',
  'that',
  'yoki',
  'bilan',
  'uchun',
  'haqida',
  'qanday',
  'qaysi',
  'nima',
  'nega',
  'kim',
]);

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0400-\u04FF\u00C0-\u024F\s]/g, ' ')
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 2 && !STOP_WORDS.has(item));
}

function scoreText(text: string, queryTokens: string[]) {
  if (queryTokens.length === 0) {
    return 0;
  }

  const haystack = ` ${text.toLowerCase()} `;
  let score = 0;

  for (const token of queryTokens) {
    if (haystack.includes(` ${token} `)) {
      score += 1;
    }
  }

  return score;
}

type KnowledgeData = {
  articles: Article[];
  philosophers: Philosopher[];
};

let knowledgePromise: Promise<KnowledgeData> | null = null;

async function loadKnowledge(): Promise<KnowledgeData> {
  if (!knowledgePromise) {
    knowledgePromise = import('./data').then((mod) => ({
      articles: mod.articles,
      philosophers: mod.philosophers,
    }));
  }

  return knowledgePromise;
}

function formatArticleContext(index: number, article: Article, lang: DualiumLang) {
  const title = lang === 'uz' ? article.title_uz : article.title_en;
  const summary = lang === 'uz' ? article.summary_uz : article.summary_en;
  const takeaways = (lang === 'uz' ? article.keyTakeaways_uz : article.keyTakeaways_en).join('; ');

  return [
    `Article ${index + 1}: ${title}`,
    `School: ${article.school}`,
    `Region: ${article.region}`,
    `Summary: ${summary}`,
    `Key points: ${takeaways}`,
    `Source slug: ${article.slug}`,
  ].join('\n');
}

function formatPhilosopherContext(index: number, philosopher: Philosopher, lang: DualiumLang) {
  const bio = lang === 'uz' ? philosopher.bio_uz : philosopher.bio_en;
  const ideas = (lang === 'uz' ? philosopher.keyIdeas_uz : philosopher.keyIdeas_en).join('; ');

  return [
    `Philosopher ${index + 1}: ${philosopher.name}`,
    `School: ${philosopher.school}`,
    `Era: ${philosopher.era}`,
    `Bio: ${bio}`,
    `Key ideas: ${ideas}`,
  ].join('\n');
}

function trimContext(content: string, maxChars = 7600) {
  if (content.length <= maxChars) {
    return content;
  }

  return `${content.slice(0, maxChars)}\n...[context trimmed]`;
}

async function getFocusedKnowledge(question: string, lang: DualiumLang) {
  const { articles, philosophers } = await loadKnowledge();
  const tokens = tokenize(question);
  const articleMatches = articles
    .map((article) => {
      const text = [
        article.school,
        lang === 'uz' ? article.title_uz : article.title_en,
        lang === 'uz' ? article.summary_uz : article.summary_en,
        ...(lang === 'uz' ? article.keyTakeaways_uz : article.keyTakeaways_en),
        ...article.concepts,
      ].join(' ');

      return {
        article,
        score: scoreText(text, tokens),
      };
    })
    .sort((a, b) => b.score - a.score);

  const philosopherMatches = philosophers
    .map((philosopher) => {
      const text = [
        philosopher.name,
        philosopher.school,
        lang === 'uz' ? philosopher.bio_uz : philosopher.bio_en,
        ...(lang === 'uz' ? philosopher.keyIdeas_uz : philosopher.keyIdeas_en),
      ].join(' ');

      return {
        philosopher,
        score: scoreText(text, tokens),
      };
    })
    .sort((a, b) => b.score - a.score);

  const selectedArticles = (articleMatches[0]?.score ?? 0) > 0 ? articleMatches.slice(0, 4) : articleMatches.slice(0, 3);
  const selectedPhilosophers =
    (philosopherMatches[0]?.score ?? 0) > 0 ? philosopherMatches.slice(0, 3) : philosopherMatches.slice(0, 2);

  const articleContext = selectedArticles.map((item, index) => formatArticleContext(index, item.article, lang)).join('\n\n');
  const philosopherContext = selectedPhilosophers
    .map((item, index) => formatPhilosopherContext(index, item.philosopher, lang))
    .join('\n\n');

  return trimContext(
    [
      'DUALIUM INTERNAL KNOWLEDGE (ranked by query relevance)',
      '',
      articleContext,
      '',
      philosopherContext,
    ].join('\n'),
  );
}

async function getPageContext(question: string, lang: DualiumLang) {
  if (typeof window === 'undefined') {
    return 'Dualium knowledge base about Ancient Eastern and Western Philosophy.';
  }

  const { articles, philosophers } = await loadKnowledge();
  const pathname = window.location.pathname;

  if (pathname.startsWith('/learn/')) {
    const slug = pathname.split('/learn/')[1] ?? '';
    const article = articles.find((item) => item.slug === slug);
    if (article) {
      const title = lang === 'uz' ? article.title_uz : article.title_en;
      const summary = lang === 'uz' ? article.summary_uz : article.summary_en;
      const takeaways = (lang === 'uz' ? article.keyTakeaways_uz : article.keyTakeaways_en).join('; ');

      return trimContext(
        [
          `CURRENT PAGE ARTICLE: ${title}`,
          `School: ${article.school}`,
          `Summary: ${summary}`,
          `Key takeaways: ${takeaways}`,
          '',
          await getFocusedKnowledge(question, lang),
        ].join('\n'),
      );
    }
  }

  if (pathname.startsWith('/philosophers/')) {
    const slug = pathname.split('/philosophers/')[1] ?? '';
    const philosopher = philosophers.find((item) => item.slug === slug);
    if (philosopher) {
      const bio = lang === 'uz' ? philosopher.bio_uz : philosopher.bio_en;
      const ideas = (lang === 'uz' ? philosopher.keyIdeas_uz : philosopher.keyIdeas_en).join('; ');

      return trimContext(
        [
          `CURRENT PAGE PHILOSOPHER: ${philosopher.name}`,
          `School: ${philosopher.school}`,
          `Bio: ${bio}`,
          `Key ideas: ${ideas}`,
          '',
          await getFocusedKnowledge(question, lang),
        ].join('\n'),
      );
    }
  }

  return getFocusedKnowledge(question, lang);
}

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 10,
            gcTime: 1000 * 60 * 30,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            networkMode: 'offlineFirst',
          },
        },
      }),
  );

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            <AppErrorBoundary>
              <AppRouter />
              <ScrollTopButton />
              <WelcomeVoice />
              <DualiumChatWidget getContext={getPageContext} />
            </AppErrorBoundary>
          </MotionConfig>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
