import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

import { Footer } from './Footer';
import { Header } from './Header';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-mist text-zinc-900 transition-colors dark:bg-ink dark:text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-30 bg-velvet dark:bg-velvet-dark" />
      <div className="pointer-events-none fixed inset-0 -z-20 opacity-55 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px] dark:opacity-15" />
      <div className="pointer-events-none fixed -top-28 -left-36 -z-10 h-[30rem] w-[30rem] rounded-full bg-ember/30 blur-3xl dark:bg-ember/20" />
      <div className="pointer-events-none fixed top-1/3 -right-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-aurora/30 blur-3xl dark:bg-aurora/20" />
      <div className="pointer-events-none fixed -bottom-40 left-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-bronze/20 blur-3xl dark:bg-bronze/10" />

      <Header />

      <main className="mx-auto w-full max-w-[92rem] px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
