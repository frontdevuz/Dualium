import type { DualiumLang } from '../lib/aiClient';
import { formatLeaderboardDuration, type LeaderboardEntry } from '../lib/leaderboardClient';

const PODIUM = ['#1', '#2', '#3'];

type LeaderboardPanelProps = {
  lang: DualiumLang;
  entries: LeaderboardEntry[];
  isLoading?: boolean;
  errorMessage?: string | null;
  title?: string;
  highlightName?: string;
};

function headingByLang(lang: DualiumLang) {
  return lang === 'uz' ? 'Top 5 Reyting' : 'Top 5 Leaderboard';
}

function emptyByLang(lang: DualiumLang) {
  return lang === 'uz' ? 'Hozircha reyting bo`sh.' : 'Leaderboard is empty for now.';
}

export function LeaderboardPanel({
  lang,
  entries,
  isLoading = false,
  errorMessage,
  title,
  highlightName,
}: LeaderboardPanelProps) {
  const heading = title ?? headingByLang(lang);
  const normalizedHighlight = highlightName?.trim().toLowerCase();

  return (
    <section className="rounded-2xl border border-zinc-200/70 bg-white/85 p-4 shadow-soft dark:border-zinc-700 dark:bg-zinc-900/70">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-300">{heading}</h3>

      {isLoading ? (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{lang === 'uz' ? 'Yuklanmoqda...' : 'Loading...'}</p>
      ) : null}

      {errorMessage ? <p className="mt-3 text-sm text-rose-500">{errorMessage}</p> : null}

      {!isLoading && !errorMessage ? (
        entries.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{emptyByLang(lang)}</p>
        ) : (
          <ol className="mt-3 space-y-2">
            {entries.map((entry, index) => {
              const isHighlight = normalizedHighlight && normalizedHighlight === entry.name.trim().toLowerCase();
              return (
                <li
                  key={`${entry.name}-${entry.submittedAt}-${entry.rank}`}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    isHighlight
                      ? 'border-jade/60 bg-jade/10'
                      : 'border-zinc-200 bg-zinc-50/90 dark:border-zinc-700 dark:bg-zinc-950/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {PODIUM[index] ? `${PODIUM[index]} ` : `#${entry.rank} `}
                      {entry.name}
                    </p>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{entry.correctCount}/{entry.total}</p>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {lang === 'uz' ? 'Vaqt' : 'Time'}: {formatLeaderboardDuration(entry.elapsedMs, lang)} · {entry.scorePercent}%
                  </p>
                </li>
              );
            })}
          </ol>
        )
      ) : null}
    </section>
  );
}
