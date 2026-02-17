const RATE_LIMIT_WINDOW_MS = 2000;
const MAX_NAME_LENGTH = 80;
const MIN_FEEDBACK_LENGTH = 5;
const MAX_FEEDBACK_LENGTH = 1500;

const ipAccessMap = new Map();

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

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function validateBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid request body' };
  }

  const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
  const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';
  const feedback = typeof body.feedback === 'string' ? body.feedback.trim() : '';
  const lang = body.lang === 'uz' ? 'uz' : 'en';

  if (!firstName || firstName.length > MAX_NAME_LENGTH) {
    return { error: `firstName must be between 1 and ${MAX_NAME_LENGTH} characters` };
  }

  if (!lastName || lastName.length > MAX_NAME_LENGTH) {
    return { error: `lastName must be between 1 and ${MAX_NAME_LENGTH} characters` };
  }

  if (feedback.length < MIN_FEEDBACK_LENGTH || feedback.length > MAX_FEEDBACK_LENGTH) {
    return {
      error: `feedback must be between ${MIN_FEEDBACK_LENGTH} and ${MAX_FEEDBACK_LENGTH} characters`,
    };
  }

  const result = body.result;
  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    return { error: 'result summary is required' };
  }

  const scorePercent = Number(result.scorePercent);
  const correctCount = Number(result.correctCount);
  const total = Number(result.total);
  const wrongCount = Number(result.wrongCount);
  const createdAt = typeof result.createdAt === 'string' ? result.createdAt : '';
  const createdAtMs = Date.parse(createdAt);

  if (
    !isFiniteNumber(scorePercent) ||
    !isFiniteNumber(correctCount) ||
    !isFiniteNumber(total) ||
    !isFiniteNumber(wrongCount) ||
    !createdAt ||
    Number.isNaN(createdAtMs)
  ) {
    return { error: 'result summary is invalid' };
  }

  return {
    value: {
      firstName,
      lastName,
      feedback,
      lang,
      result: {
        scorePercent,
        correctCount,
        total,
        wrongCount,
        createdAt: new Date(createdAtMs).toISOString(),
      },
    },
  };
}

function buildFeedbackText(payload) {
  const person = `${payload.firstName} ${payload.lastName}`;

  return [
    'Dualium Quiz Feedback',
    '',
    `Name: ${person}`,
    `Language: ${payload.lang.toUpperCase()}`,
    `Score: ${payload.result.scorePercent}% (${payload.result.correctCount}/${payload.result.total})`,
    `Wrong Answers: ${payload.result.wrongCount}`,
    `Submitted At: ${payload.result.createdAt}`,
    '',
    'Feedback:',
    payload.feedback,
  ].join('\n');
}

export default async function handler(req, res) {
  setSecurityHeaders(res);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const now = Date.now();
  const clientIp = getClientIp(req);
  cleanupAccessMap(now);

  const lastAccess = ipAccessMap.get(clientIp);
  if (typeof lastAccess === 'number' && now - lastAccess < RATE_LIMIT_WINDOW_MS) {
    return res.status(429).json({ error: 'Too many requests. Slow down.' });
  }
  ipAccessMap.set(clientIp, now);

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const validation = validateBody(body);
    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({
        error: 'Server is missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID',
      });
    }

    const text = buildFeedbackText(validation.value);

    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });

    const telegramData = await telegramResponse.json().catch(() => ({}));

    if (!telegramResponse.ok || telegramData?.ok !== true) {
      return res.status(500).json({
        error: 'Failed to deliver feedback to Telegram',
      });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
