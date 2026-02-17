export type DualiumLang = 'uz' | 'en';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type BuildMessageInput = {
  lang: DualiumLang;
  question: string;
  context: string;
};

const DONT_KNOW_TEXT: Record<DualiumLang, string> = {
  uz: 'Berilgan material asosida aniq javob topilmadi.',
  en: 'I couldn’t find an exact answer in the provided material.',
};

export function buildDualiumMessages({ lang, question, context }: BuildMessageInput): ChatMessage[] {
  const systemPrompt =
    lang === 'uz'
      ? [
          'Sen Dualium tutorisan.',
          'Javob berishda avval berilgan CONTEXTni ustuvor ishlat.',
          'Agar context yetarli bo`lmasa, aniq va ishonchli umumiy bilimdan foydalan.',
          'Foydalanuvchi savoli Dualium mavzusidan tashqarida bo`lsa ham qisqa va foydali javob ber.',
          'Agar savol oddiy salomlashuv yoki minnatdorchilik bo`lsa, muloyim va qisqa javob ber.',
          'Noto`g`ri ma`lumot o`ylab topma. Ishonching past bo`lsa, aniq qilib ayt.',
          'Javob aniq, sodda va odatiy tabiiy uslubda bo`lsin.',
          'Quiz izohlarida punktlar bilan yoz va oxirida aynan 1 ta qisqa tip ber.',
          'Javobni ortiqcha cho`zma.',
        ].join('\n')
      : [
          'You are Dualium Tutor.',
          'Prioritize the provided CONTEXT first.',
          'If context is not enough, answer using reliable general knowledge.',
          'If the question is outside Dualium topics, still provide a brief helpful answer.',
          'If the user sends a simple greeting/thanks, reply politely and briefly.',
          'Do not fabricate facts. If confidence is low, say so clearly.',
          'Use a natural, clear, human conversational tone.',
          'For quiz explanations, use bullet points and end with exactly 1 short tip.',
          'Keep responses concise.',
        ].join('\n');

  const userPrompt = [
    'CONTEXT:',
    context || '(empty)',
    '',
    'QUESTION:',
    question,
  ].join('\n');

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

export async function askDualium({
  lang,
  question,
  context,
  model,
  temperature = 0.2,
}: {
  lang: DualiumLang;
  question: string;
  context: string;
  model?: string;
  temperature?: number;
}) {
  const messages = buildDualiumMessages({ lang, question, context });

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, model, temperature }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const reason = typeof payload?.error === 'string' ? payload.error : 'Request failed';
    throw new Error(reason);
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === 'string' && content.trim().length > 0) {
    return content.trim();
  }

  return DONT_KNOW_TEXT[lang];
}

export function getDontKnowPhrase(lang: DualiumLang) {
  return DONT_KNOW_TEXT[lang];
}
