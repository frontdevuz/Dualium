import type { DualiumLang } from './aiClient';

export type LeaderboardEntry = {
  rank: number;
  name: string;
  scorePercent: number;
  correctCount: number;
  total: number;
  elapsedMs: number;
  submittedAt: string;
  lang: DualiumLang;
};

export async function fetchLeaderboard(limit = 5): Promise<LeaderboardEntry[]> {
  const response = await fetch(`/api/leaderboard?limit=${limit}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const reason = typeof payload?.error === 'string' ? payload.error : 'Failed to load leaderboard';
    throw new Error(reason);
  }

  return Array.isArray(payload?.entries) ? (payload.entries as LeaderboardEntry[]) : [];
}

export async function submitLeaderboardEntry(payload: {
  name: string;
  scorePercent: number;
  correctCount: number;
  total: number;
  elapsedMs: number;
  lang: DualiumLang;
  submittedAt?: string;
}) {
  const response = await fetch('/api/leaderboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const reason = typeof data?.error === 'string' ? data.error : 'Failed to submit leaderboard score';
    throw new Error(reason);
  }

  return Array.isArray(data?.entries) ? (data.entries as LeaderboardEntry[]) : [];
}

export function formatLeaderboardDuration(ms: number, lang: DualiumLang) {
  const seconds = Math.max(1, Math.round(ms / 1000));
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  if (lang === 'uz') {
    if (minutes > 0) {
      return `${minutes} daqiqa ${restSeconds} soniya`;
    }

    return `${restSeconds} soniya`;
  }

  if (minutes > 0) {
    return `${minutes}m ${restSeconds}s`;
  }

  return `${restSeconds}s`;
}
