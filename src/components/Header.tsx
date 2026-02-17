import { motion } from 'framer-motion';
import { FormEvent, MouseEvent, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { BrandLogo } from './BrandLogo';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/utils';

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const links = [
    { to: '/', label: t('common.home') },
    { to: '/learn', label: t('common.learn') },
    { to: '/philosophers', label: t('common.philosophers') },
    { to: '/timeline', label: t('common.timeline') },
    { to: '/quiz', label: t('common.quiz') },
  ];

  useEffect(() => {
    if (location.pathname === '/search') {
      const nextQuery = new URLSearchParams(location.search).get('q') ?? '';
      setQuery(nextQuery);
    }
  }, [location.pathname, location.search]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      navigate('/search');
      return;
    }

    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  const onBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 80);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/70 backdrop-blur-2xl dark:border-zinc-700/60 dark:bg-zinc-950/70"
    >
      <div className="mx-auto flex w-full max-w-[92rem] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" onClick={onBrandClick} className="order-1 inline-flex items-center">
          <BrandLogo
            subtitle="Ancient Philosophy Atelier"
            titleClassName="text-3xl sm:text-3xl"
            subtitleClassName="tracking-[0.16em]"
          />
        </a>

        <div className="order-2 ml-auto flex items-center gap-2 lg:order-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <nav className="no-scrollbar order-3 flex w-full items-center gap-1 overflow-x-auto rounded-full border border-zinc-300/70 bg-white/85 p-1 shadow-soft lg:order-2 lg:w-auto lg:flex-1 dark:border-zinc-700 dark:bg-zinc-900/75">
          <form onSubmit={onSubmit} className="mr-1 flex shrink-0 items-center gap-1">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('search.placeholder')}
              className="w-28 rounded-full border border-zinc-300/80 bg-white/90 px-3 py-1.5 text-sm text-zinc-800 outline-none ring-aurora/30 transition focus:ring-2 min-[420px]:w-40 sm:w-56 dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-100"
            />
            <button
              type="submit"
              className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <span className="sm:hidden">Go</span>
              <span className="hidden sm:inline">{t('common.search')}</span>
            </button>
          </form>

          {links.map((link) => {
            const isActive =
              link.to === '/'
                ? location.pathname === '/'
                : location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);

            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={cn(
                  'relative rounded-full px-3 py-1.5 text-sm font-semibold transition duration-200',
                  isActive
                    ? 'text-white dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800/70',
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="dualium-nav-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-zinc-900 via-velvet to-aurora shadow-aura dark:from-zinc-50 dark:via-zinc-200 dark:to-zinc-300"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative z-10">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
