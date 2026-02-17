import { askDualium, type DualiumLang } from './aiClient';

export async function explainWrongAnswer({
  lang,
  prompt,
  correctAnswer,
  userAnswer,
  context,
  source,
}: {
  lang: DualiumLang;
  prompt: string;
  correctAnswer: string | boolean;
  userAnswer: string | boolean;
  context: string;
  source: { articleSlug?: string; section?: string };
}) {
  const sourceLabel = [source.articleSlug, source.section].filter(Boolean).join(' -> ') || 'unknown source';

  const task =
    lang === 'uz'
      ? [
          `Savol: ${prompt}`,
          `Togri javob: ${String(correctAnswer)}`,
          `Foydalanuvchi javobi: ${String(userAnswer)}`,
          'Nima uchun togri javob togri, foydalanuvchi javobi esa notogri ekanini tushuntir.',
          'Faqat kontekstga tayangan holda tushuntir.',
          'Oxirida qisqa bitta tip qo`sh.',
        ].join('\n')
      : [
          `Question: ${prompt}`,
          `Correct answer: ${String(correctAnswer)}`,
          `User answered: ${String(userAnswer)}`,
          'Explain why the correct answer is correct and the user answer is wrong.',
          'Use the provided context only.',
          'Add one short tip at the end.',
        ].join('\n');

  const mergedContext = `SOURCE: ${sourceLabel}\n\n${context || 'No extra context provided.'}`;

  return askDualium({
    lang,
    question: task,
    context: mergedContext,
    temperature: 0.2,
  });
}
