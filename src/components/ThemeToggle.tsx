import { useTranslation } from 'react-i18next';

import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition',
        'border-zinc-300 bg-white/80 text-zinc-900 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:bg-zinc-900',
      )}
      aria-label={t('common.language')}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
