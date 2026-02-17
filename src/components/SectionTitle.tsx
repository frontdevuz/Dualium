import { motion } from 'framer-motion';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.35 }}
      className="mb-8"
    >
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-4xl font-semibold leading-none tracking-wide text-zinc-900 sm:text-5xl dark:text-zinc-50">
        {title}
      </h2>
      {description ? <p className="mt-3 max-w-3xl text-sm text-zinc-600 dark:text-zinc-300">{description}</p> : null}
    </motion.div>
  );
}
