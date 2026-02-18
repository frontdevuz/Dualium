import { AnimatePresence, motion } from 'framer-motion';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

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

  const isActiveLink = (to: string) =>
    to === '/'
      ? location.pathname === '/'
      : location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <>
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
            <form onSubmit={onSubmit} className="mr-1 flex min-w-0 flex-1 items-center gap-1 lg:flex-none">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full rounded-full border border-zinc-300/80 bg-white/90 px-3 py-1.5 text-sm text-zinc-800 outline-none ring-aurora/30 transition focus:ring-2 sm:w-56 dark:border-zinc-700 dark:bg-zinc-950/80 dark:text-zinc-100"
              />
              <button
                type="submit"
                className="rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <span className="sm:hidden">Go</span>
                <span className="hidden sm:inline">{t('common.search')}</span>
              </button>
            </form>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="ml-auto inline-flex h-9 w-10 items-center justify-center rounded-full border border-zinc-300/80 text-zinc-700 transition hover:bg-zinc-200/70 lg:hidden dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800/70"
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="tablet-sidebar-menu"
            >
              <span className="sr-only">Open menu</span>
              <span className="relative block h-4 w-4">
                <span className="absolute top-0.5 left-0 block h-0.5 w-4 rounded bg-current" />
                <span className="absolute top-1.5 left-0 block h-0.5 w-4 rounded bg-current" />
                <span className="absolute top-2.5 left-0 block h-0.5 w-4 rounded bg-current" />
              </span>
            </button>

            <div className="hidden flex-1 items-center justify-center gap-3 lg:flex lg:translate-x-[70px]">
              {links.map((link) => {
                const isActive = isActiveLink(link.to);

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-sm font-semibold transition duration-200',
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
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-[68] bg-zinc-950/45 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              id="tablet-sidebar-menu"
              className="fixed top-0 right-0 z-[69] h-dvh w-[min(22rem,88vw)] border-l border-zinc-200/70 bg-white/95 p-4 shadow-2xl backdrop-blur dark:border-zinc-700 dark:bg-zinc-950/95 lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">Menu</p>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition hover:bg-zinc-200/80 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {links.map((link) => {
                  const isActive = isActiveLink(link.to);

                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'rounded-xl px-4 py-3 text-sm font-semibold transition',
                        isActive
                          ? 'bg-gradient-to-r from-zinc-900 via-velvet to-aurora text-white dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-300 dark:text-zinc-900'
                          : 'text-zinc-700 hover:bg-zinc-200/80 dark:text-zinc-200 dark:hover:bg-zinc-800',
                      )}
                    >
                      {link.label}
                    </NavLink>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
