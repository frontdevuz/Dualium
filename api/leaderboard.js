const RATE_LIMIT_WINDOW_MS = 1200;
const MAX_NAME_LENGTH = 80;
const MIN_NAME_LENGTH = 2;
const MAX_BODY_CHARS = 6000;
const MAX_ENTRIES = 200;
const DEFAULT_LIMIT = 5;

const ipAccessMap = new Map();
const bestByUserMap = new Map();

function setSecurityHeaders(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }

  return req.socket?.remoteAddress ?? 'unknown';
}

function cleanupAccessMap(now) {
  if (ipAccessMap.size < 5000) {
    return;
  }

  for (const [ip, lastAccess] of ipAccessMap.entries()) {
    if (now - lastAccess > 60_000) {
      ipAccessMap.delete(ip);
    }
  }
}

function normalizeName(input) {
  return input
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseBody(rawBody) {
  if (typeof rawBody === 'string') {
    if (rawBody.length > MAX_BODY_CHARS) {
      return { error: `request body exceeds ${MAX_BODY_CHARS} characters` };
    }

    try {
      const parsed = JSON.parse(rawBody);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { error: 'request body must be a JSON object' };
      }

      return { value: parsed };
    } catch {
      return { error: 'invalid JSON body' };
    }
  }

  if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
    return { error: 'request body must be a JSON object' };
  }

  return { value: rawBody };
}

function validatePayload(body) {
  const rawName = typeof body.name === 'string' ? body.name : '';
  const name = normalizeName(rawName);
  if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
    return { error: `name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters` };
  }

  const scorePercent = Number(body.scorePercent);
  const correctCount = Number(body.correctCount);
  const total = Number(body.total);
  const elapsedMs = Number(body.elapsedMs);

  if (!Number.isFinite(scorePercent) || scorePercent < 0 || scorePercent > 100) {
    return { error: 'scorePercent must be between 0 and 100' };
  }

  if (!Number.isFinite(total) || total < 1 || total > 200) {
    return { error: 'total must be between 1 and 200' };
  }

  if (!Number.isFinite(correctCount) || correctCount < 0 || correctCount > total) {
    return { error: 'correctCount must be between 0 and total' };
  }

  if (!Number.isFinite(elapsedMs) || elapsedMs < 1000 || elapsedMs > 21_600_000) {
    return { error: 'elapsedMs must be between 1000 and 21600000' };
  }

  const lang = body.lang === 'uz' ? 'uz' : 'en';
  const submittedAtMs = typeof body.submittedAt === 'string' ? Date.parse(body.submittedAt) : Date.now();
  const submittedAt = Number.isNaN(submittedAtMs) ? new Date().toISOString() : new Date(submittedAtMs).toISOString();

  return {
    value: {
      id: `lb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      nameKey: name.toLowerCase(),
      scorePercent: Math.round(scorePercent * 100) / 100,
      correctCount: Math.round(correctCount),
      total: Math.round(total),
      elapsedMs: Math.round(elapsedMs),
      lang,
      submittedAt,
    },
  };
}

function compareEntries(a, b) {
  if (a.correctCount !== b.correctCount) {
    return b.correctCount - a.correctCount;
  }

  if (a.scorePercent !== b.scorePercent) {
    return b.scorePercent - a.scorePercent;
  }

  if (a.elapsedMs !== b.elapsedMs) {
    return a.elapsedMs - b.elapsedMs;
  }

  return Date.parse(a.submittedAt) - Date.parse(b.submittedAt);
}

function isBetter(next, current) {
  return compareEntries(next, current) < 0;
}

function sortedEntries() {
  return Array.from(bestByUserMap.values()).sort(compareEntries);
}

function trimEntries() {
  const entries = sortedEntries();
  if (entries.length <= MAX_ENTRIES) {
    return;
  }

  const keep = new Set(entries.slice(0, MAX_ENTRIES).map((entry) => entry.nameKey));
  for (const key of bestByUserMap.keys()) {
    if (!keep.has(key)) {
      bestByUserMap.delete(key);
    }
  }
}

function toPublicEntry(entry, index) {
  return {
    rank: index + 1,
    name: entry.name,
    scorePercent: entry.scorePercent,
    correctCount: entry.correctCount,
    total: entry.total,
    elapsedMs: entry.elapsedMs,
    submittedAt: entry.submittedAt,
    lang: entry.lang,
  };
}

function resolveLimit(reqUrl) {
  try {
    const url = new URL(reqUrl ?? '', 'http://localhost');
    const raw = Number(url.searchParams.get('limit'));
    if (!Number.isFinite(raw)) {
      return DEFAULT_LIMIT;
    }

    return Math.max(1, Math.min(20, Math.round(raw)));
  } catch {
    return DEFAULT_LIMIT;
  }
}

export default async function handler(req, res) {
  setSecurityHeaders(res);

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const now = Date.now();
  const clientIp = getClientIp(req);
  cleanupAccessMap(now);

  const rateKey = `${clientIp}:${req.method}`;
  const lastAccess = ipAccessMap.get(rateKey);
  if (typeof lastAccess === 'number' && now - lastAccess < RATE_LIMIT_WINDOW_MS) {
    return res.status(429).json({ error: 'Too many requests. Slow down.' });
  }
  ipAccessMap.set(rateKey, now);

  if (req.method === 'GET') {
    const limit = resolveLimit(req.url);
    const entries = sortedEntries()
      .slice(0, limit)
      .map((entry, index) => toPublicEntry(entry, index));

    return res.status(200).json({
      entries,
      totalPlayers: bestByUserMap.size,
      limit,
    });
  }

  const parsedBody = parseBody(req.body);
  if (parsedBody.error) {
    return res.status(400).json({ error: parsedBody.error });
  }

  const validation = validatePayload(parsedBody.value);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  const incoming = validation.value;
  const current = bestByUserMap.get(incoming.nameKey);

  if (!current || isBetter(incoming, current)) {
    bestByUserMap.set(incoming.nameKey, incoming);
    trimEntries();
  }

  const entries = sortedEntries()
    .slice(0, DEFAULT_LIMIT)
    .map((entry, index) => toPublicEntry(entry, index));

  return res.status(200).json({
    ok: true,
    updated: !current || isBetter(incoming, current),
    entries,
    totalPlayers: bestByUserMap.size,
  });
}
