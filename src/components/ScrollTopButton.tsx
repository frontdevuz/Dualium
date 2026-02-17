import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 360);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.94 }}
          transition={{ duration: 0.22 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-5 bottom-20 z-[60] rounded-full border border-zinc-300/90 bg-white/95 px-4 py-3 text-sm font-semibold text-zinc-800 shadow-soft transition hover:-translate-y-0.5 hover:bg-zinc-100 sm:right-44 sm:bottom-5 dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Scroll to top"
        >
          ↑ Top
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
