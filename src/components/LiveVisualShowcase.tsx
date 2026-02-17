import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import type { LanguageCode } from '../lib/content';
import { getLiveSlides } from '../lib/visuals';

type LiveVisualShowcaseProps = {
  language: LanguageCode;
};

function formatClock(now: Date) {
  return now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function LiveVisualShowcase({ language }: LiveVisualShowcaseProps) {
  const slides = useMemo(() => getLiveSlides('mixed'), []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [clock, setClock] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
      setClock(formatClock(new Date()));
    }, 4200);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[activeIndex];

  return (
    <section className="mt-12 rounded-3xl border border-zinc-200/70 bg-white/80 p-4 shadow-soft dark:border-zinc-800 dark:bg-zinc-900/70 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
          {language === 'uz' ? 'Jonli vizual oqim' : 'Live visual stream'}
        </p>
        <p className="rounded-full border border-zinc-300/70 bg-zinc-100/90 px-3 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {language === 'uz' ? 'Real-time yangilanish' : 'Realtime update'} · {clock}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-zinc-700">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeSlide.id}
              src={activeSlide.image}
              alt={activeSlide.title}
              initial={{ opacity: 0.24, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.24, scale: 0.98 }}
              transition={{ duration: 0.55 }}
              className="h-[280px] w-full object-cover sm:h-[340px]"
            />
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/72 via-zinc-900/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <h3 className="font-display text-3xl leading-none tracking-wide text-white sm:text-4xl">{activeSlide.title}</h3>
            <p className="mt-2 max-w-xl text-sm text-zinc-100/90">{activeSlide.subtitle}</p>
          </div>
        </div>

        <div className="grid gap-3">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-xl border p-3 text-left transition ${
                  isActive
                    ? 'border-aurora/70 bg-aurora/10 shadow-soft'
                    : 'border-zinc-200/80 bg-white/80 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900/70 dark:hover:border-zinc-600'
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                  {slide.region === 'mixed'
                    ? language === 'uz'
                      ? 'Aralash'
                      : 'Mixed'
                    : slide.region === 'east'
                      ? language === 'uz'
                        ? 'Sharq'
                        : 'East'
                      : language === 'uz'
                        ? 'G`arb'
                        : 'West'}
                </p>
                <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">{slide.title}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
