import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

import { askDualium, getDontKnowPhrase, type DualiumLang } from '../lib/aiClient';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type DualiumChatWidgetProps = {
  getContext: (question: string, lang: DualiumLang) => string | Promise<string>;
};

const GENERIC_CONTEXT =
  [
    'Dualium internal knowledge summary:',
    'Eastern schools: Confucianism (ren, li, junzi), Daoism (dao, wu wei), Legalism (fa, shu, shi), Mohism (jian ai), Buddhism (Four Noble Truths, Eightfold Path), Jainism (ahimsa, anekantavada).',
    'Western schools and thinkers: Socrates (elenchus), Plato (Forms, justice), Aristotle (eudaimonia, golden mean), Stoicism (control distinction, logos), Epicureanism (ataraxia, prudence).',
    'Central and Islamic thinkers included in Dualium: Al-Farabi, Ibn Sina, Al-Biruni, Al-Khwarizmi, al-Maturidi, Alisher Navoiy, Ulugh Beg, Al-Ghazali, Rumi, Ibn Rushd.',
    'Always stay concise and source-aware.',
  ].join('\n');

function getGreeting(lang: DualiumLang) {
  return lang === 'uz'
    ? 'Dualium materiallari asosida tushuntira olaman. Savol bering.'
    : 'I can explain philosophy topics using Dualium content. Ask anything.';
}

function createId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function DualiumChatWidget({ getContext }: DualiumChatWidgetProps) {
  const initialLang: DualiumLang = 'en';
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<DualiumLang>(initialLang);
  const [usePageContext, setUsePageContext] = useState(true);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createId(),
      role: 'assistant',
      content: getGreeting(initialLang),
    },
  ]);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const dontKnowPhrase = useMemo(() => getDontKnowPhrase(lang), [lang]);
  const showContextHint = useMemo(() => {
    const lastAssistant = [...messages].reverse().find((item) => item.role === 'assistant');
    if (!lastAssistant) {
      return false;
    }

    return lastAssistant.content.includes(dontKnowPhrase);
  }, [dontKnowPhrase, messages]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || isTyping) {
      return;
    }

    setInput('');
    setMessages((prev) => [...prev, { id: createId(), role: 'user', content: question }]);
    setIsTyping(true);

    try {
      const context = usePageContext ? await Promise.resolve(getContext(question, lang)) : GENERIC_CONTEXT;
      const response = await askDualium({
        lang,
        question,
        context,
      });

      setMessages((prev) => [...prev, { id: createId(), role: 'assistant', content: response }]);
    } catch (error) {
      const fallback =
        lang === 'uz'
          ? `Xatolik yuz berdi: ${error instanceof Error ? error.message : 'Noma`lum xatolik'}`
          : `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setMessages((prev) => [...prev, { id: createId(), role: 'assistant', content: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed right-5 bottom-5 z-[60] rounded-full bg-gradient-to-r from-zinc-900 via-velvet to-aurora px-4 py-3 text-sm font-semibold text-white shadow-2xl transition hover:brightness-105 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-300 dark:text-zinc-900"
      >
        {isOpen ? 'Close Tutor' : 'Dualium Tutor'}
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.section
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed right-5 bottom-20 z-[60] w-[min(92vw,420px)] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
          >
            <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Dualium Tutor</p>
                <label className="mt-1 inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <input
                    type="checkbox"
                    checked={usePageContext}
                    onChange={(event) => setUsePageContext(event.target.checked)}
                  />
                  Use page context
                </label>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-full border border-zinc-300 p-1 dark:border-zinc-700">
                  {(['en', 'uz'] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLang(code)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                        lang === code
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Esc
                </button>
              </div>
            </header>

            <div className="max-h-[48vh] space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'ml-auto bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100'
                  }`}
                >
                  {message.content}
                </div>
              ))}

              {isTyping ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:240ms]" />
                </div>
              ) : null}

              {showContextHint ? (
                <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
                  Open an article page for more precise context.
                </p>
              ) : null}
            </div>

            <div className="border-t border-zinc-200 p-3 dark:border-zinc-700">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                rows={2}
                placeholder={lang === 'uz' ? 'Savolingizni yozing...' : 'Ask your question...'}
                className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 caret-jade outline-none ring-jade/30 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-400"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Enter to send · Shift+Enter newline</p>
                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={isTyping || input.trim().length === 0}
                  className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition enabled:hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:enabled:hover:bg-zinc-200"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  );
}
