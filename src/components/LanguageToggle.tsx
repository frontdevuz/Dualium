import { useTranslation } from 'react-i18next';

import { cn } from '../lib/utils';

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const active = (language: 'en' | 'uz') => i18n.resolvedLanguage?.startsWith(language);

  return (
    <div className="inline-flex rounded-full border border-zinc-300 p-1 dark:border-zinc-700">
      {(['en', 'uz'] as const).map((language) => (
        <button
          key={language}
          type="button"
          onClick={() => void i18n.changeLanguage(language)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold transition',
            active(language)
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800/70',
          )}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
