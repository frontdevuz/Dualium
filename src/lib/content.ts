import { articles, concepts, philosophers } from '../data';
import type { Article, Philosopher, Region } from '../data';

export type LanguageCode = 'en' | 'uz';

const articleBySlug = new Map(articles.map((article) => [article.slug, article]));
const philosopherBySlug = new Map(philosophers.map((philosopher) => [philosopher.slug, philosopher]));
const conceptBySlug = new Map(concepts.map((concept) => [concept.slug, concept]));
const articlesByRegion = {
  east: articles.filter((article) => article.region === 'east'),
  west: articles.filter((article) => article.region === 'west'),
} as const;
const philosophersByRegion = {
  east: philosophers.filter((philosopher) => philosopher.region === 'east'),
  west: philosophers.filter((philosopher) => philosopher.region === 'west'),
} as const;

export function getLocalizedArticleTitle(article: Article, language: LanguageCode) {
  return language === 'uz' ? article.title_uz : article.title_en;
}

export function getLocalizedArticleSummary(article: Article, language: LanguageCode) {
  return language === 'uz' ? article.summary_uz : article.summary_en;
}

export function getLocalizedArticleContent(article: Article, language: LanguageCode) {
  return language === 'uz' ? article.content_uz : article.content_en;
}

export function getLocalizedArticleTakeaways(article: Article, language: LanguageCode) {
  return language === 'uz' ? article.keyTakeaways_uz : article.keyTakeaways_en;
}

export function getLocalizedPhilosopherBio(philosopher: Philosopher, language: LanguageCode) {
  return language === 'uz' ? philosopher.bio_uz : philosopher.bio_en;
}

export function getLocalizedPhilosopherIdeas(philosopher: Philosopher, language: LanguageCode) {
  return language === 'uz' ? philosopher.keyIdeas_uz : philosopher.keyIdeas_en;
}

export function getLocalizedPhilosopherQuote(philosopher: Philosopher, language: LanguageCode) {
  return language === 'uz' ? philosopher.quote_uz : philosopher.quote_en;
}

export function getLocalizedConceptName(conceptSlug: string, language: LanguageCode) {
  const concept = conceptBySlug.get(conceptSlug);
  if (!concept) {
    return conceptSlug;
  }

  return language === 'uz' ? concept.name_uz : concept.name_en;
}

export async function fetchArticles() {
  return Promise.resolve(articles);
}

export async function fetchArticleBySlug(slug: string) {
  return Promise.resolve(articleBySlug.get(slug));
}

export async function fetchPhilosophers() {
  return Promise.resolve(philosophers);
}

export async function fetchPhilosopherBySlug(slug: string) {
  return Promise.resolve(philosopherBySlug.get(slug));
}

export async function fetchConcepts() {
  return Promise.resolve(concepts);
}

export function filterArticlesByRegion(target: Region | 'mixed') {
  if (target === 'mixed') {
    return articles;
  }

  return articlesByRegion[target];
}

export function getArticleBySlug(slug?: string) {
  if (!slug) {
    return undefined;
  }

  return articleBySlug.get(slug);
}

export function getPhilosophersByRegion(target: Region | 'mixed') {
  if (target === 'mixed') {
    return philosophers;
  }

  return philosophersByRegion[target];
}

export function getArticleTitleBySlug(slug: string, language: LanguageCode) {
  const article = articleBySlug.get(slug);
  if (!article) {
    return slug;
  }

  return getLocalizedArticleTitle(article, language);
}
