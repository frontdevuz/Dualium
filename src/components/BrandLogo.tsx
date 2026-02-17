import { motion } from 'framer-motion';

import { cn } from '../lib/utils';

type BrandLogoProps = {
  showText?: boolean;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  subtitle?: string;
};

export function BrandLogo({
  showText = true,
  className,
  textClassName,
  iconClassName,
  titleClassName,
  subtitleClassName,
  subtitle = 'Ancient East x West Wisdom',
}: BrandLogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <motion.img
        initial={{ rotate: -5, scale: 0.94, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
        src="/dualium-logo.svg"
        alt="Dualium logo"
        className={cn('h-10 w-10 rounded-xl shadow-soft', iconClassName)}
      />

      {showText ? (
        <div className={cn('leading-tight', textClassName)}>
          <p className={cn('font-display text-2xl font-semibold tracking-wide text-zinc-900 dark:text-zinc-100', titleClassName)}>
            Dualium
          </p>
          <p className={cn('-mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400', subtitleClassName)}>
            {subtitle}
          </p>
        </div>
      ) : null}
    </div>
  );
}
