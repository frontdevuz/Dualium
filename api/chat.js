const RATE_LIMIT_WINDOW_MS = 1500;
const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 12000;
const MAX_TOTAL_MESSAGE_CHARS = 80000;
const MAX_BODY_CHARS = 200000;
const REQUEST_TIMEOUT_MS = 20000;
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

const ipAccessMap = new Map();

function setSecurityHeaders(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}
//testing
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

function parseRequestBody(rawBody) {
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

function validateMessages(messages) {
  if (!Array.isArray(messages)) {
    return { error: 'messages must be an array' };
  }

  if (messages.length === 0 || messages.length > MAX_MESSAGES) {
    return { error: `messages length must be between 1 and ${MAX_MESSAGES}` };
  }

  let totalChars = 0;

  for (const message of messages) {
    if (!message || typeof message !== 'object' || Array.isArray(message)) {
      return { error: 'each message must be an object' };
    }

    const { role, content } = message;
    if (!['system', 'user', 'assistant'].includes(role)) {
      return { error: 'message role must be system, user, or assistant' };
    }

    if (typeof content !== 'string') {
      return { error: 'message content must be a string' };
    }

    const trimmed = content.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_MESSAGE_CHARS) {
      return { error: `message content length must be between 1 and ${MAX_MESSAGE_CHARS}` };
    }

    totalChars += trimmed.length;
    if (totalChars > MAX_TOTAL_MESSAGE_CHARS) {
      return { error: `total message content exceeds ${MAX_TOTAL_MESSAGE_CHARS} characters` };
    }
  }

  return { value: true };
}

function validateModel(model) {
  if (model === undefined) {
    return { value: DEFAULT_MODEL };
  }

  if (typeof model !== 'string') {
    return { error: 'model must be a string' };
  }

  const normalizedModel = model.trim();
  if (!normalizedModel) {
    return { value: DEFAULT_MODEL };
  }

  if (normalizedModel.length > 80 || !/^[a-zA-Z0-9._:-]+$/.test(normalizedModel)) {
    return { error: 'model format is invalid' };
  }

  return { value: normalizedModel };
}

function validateTemperature(temperature) {
  if (temperature === undefined) {
    return { value: 0.3 };
  }

  if (typeof temperature !== 'number' || !Number.isFinite(temperature)) {
    return { error: 'temperature must be a finite number' };
  }

  if (temperature < 0 || temperature > 2) {
    return { error: 'temperature must be between 0 and 2' };
  }

  return { value: temperature };
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

  const parsedBody = parseRequestBody(req.body);
  if (parsedBody.error) {
    return res.status(400).json({ error: parsedBody.error });
  }

  const { messages, model, temperature } = parsedBody.value;

  const messagesValidation = validateMessages(messages);
  if (messagesValidation.error) {
    return res.status(400).json({ error: messagesValidation.error });
  }

  const modelValidation = validateModel(model);
  if (modelValidation.error) {
    return res.status(400).json({ error: modelValidation.error });
  }

  const temperatureValidation = validateTemperature(temperature);
  if (temperatureValidation.error) {
    return res.status(400).json({ error: temperatureValidation.error });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Server is missing GROQ_API_KEY' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const upstreamResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelValidation.value,
        temperature: temperatureValidation.value,
        messages,
      }),
      signal: controller.signal,
    });

    const data = await upstreamResponse.json().catch(() => ({}));

    if (!upstreamResponse.ok) {
      const upstreamError =
        typeof data?.error?.message === 'string' && data.error.message.trim().length > 0
          ? data.error.message
          : 'Groq upstream error';

      return res.status(502).json({
        error: upstreamError,
        upstreamStatus: upstreamResponse.status,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(500).json({ error: 'Request timeout while calling Groq' });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    clearTimeout(timeout);
  }
}
