import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from '../components/Layout';

const HomePage = lazy(() => import('./HomePage').then((mod) => ({ default: mod.HomePage })));
const LearnPage = lazy(() => import('./LearnPage').then((mod) => ({ default: mod.LearnPage })));
const ArticlePage = lazy(() => import('./ArticlePage').then((mod) => ({ default: mod.ArticlePage })));
const PhilosophersPage = lazy(() => import('./PhilosophersPage').then((mod) => ({ default: mod.PhilosophersPage })));
const PhilosopherDetailPage = lazy(() =>
  import('./PhilosopherDetailPage').then((mod) => ({ default: mod.PhilosopherDetailPage })),
);
const TimelinePage = lazy(() => import('./TimelinePage').then((mod) => ({ default: mod.TimelinePage })));
const QuizPage = lazy(() => import('./QuizPage').then((mod) => ({ default: mod.QuizPage })));
const QuizResultPage = lazy(() => import('./QuizResultPage').then((mod) => ({ default: mod.QuizResultPage })));
const SearchPage = lazy(() => import('./SearchPage').then((mod) => ({ default: mod.SearchPage })));
const NotFoundPage = lazy(() => import('./NotFoundPage').then((mod) => ({ default: mod.NotFoundPage })));

function PageFallback() {
  return (
    <div className="rounded-2xl border border-zinc-200/70 bg-white/75 p-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300">
      Loading page...
    </div>
  );
}

function withSuspense(element: JSX.Element) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={withSuspense(<HomePage />)} />
          <Route path="learn" element={withSuspense(<LearnPage />)} />
          <Route path="learn/:slug" element={withSuspense(<ArticlePage />)} />
          <Route path="philosophers" element={withSuspense(<PhilosophersPage />)} />
          <Route path="philosophers/:slug" element={withSuspense(<PhilosopherDetailPage />)} />
          <Route path="timeline" element={withSuspense(<TimelinePage />)} />
          <Route path="search" element={withSuspense(<SearchPage />)} />
          <Route path="quiz" element={withSuspense(<QuizPage />)} />
          <Route path="quiz/result" element={withSuspense(<QuizResultPage />)} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="*" element={withSuspense(<NotFoundPage />)} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
