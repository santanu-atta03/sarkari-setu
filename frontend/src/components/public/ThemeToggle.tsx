'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-3 w-10 h-10 border border-black/5 dark:border-white/10 rounded-xl bg-white/50 dark:bg-zinc-900/50" />;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="relative p-2.5 w-11 h-11 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-xl text-zinc-900 dark:text-white hover:scale-110 active:scale-95 transition-all shadow-xl shadow-blue-500/5 overflow-hidden group"
      aria-label="Toggle theme"
    >
       <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
       
       <AnimatePresence mode='wait' initial={false}>
         {resolvedTheme === 'dark' ? (
           <motion.div
             key="sun"
             initial={{ y: 20, rotate: 45, opacity: 0 }}
             animate={{ y: 0, rotate: 0, opacity: 1 }}
             exit={{ y: -20, rotate: -45, opacity: 0 }}
             transition={{ duration: 0.2 }}
             className="flex items-center justify-center"
           >
              <Sun size={20} className="text-yellow-500" strokeWidth={2.5} />
           </motion.div>
         ) : (
           <motion.div
             key="moon"
             initial={{ y: 20, rotate: 45, opacity: 0 }}
             animate={{ y: 0, rotate: 0, opacity: 1 }}
             exit={{ y: -20, rotate: -45, opacity: 0 }}
             transition={{ duration: 0.2 }}
             className="flex items-center justify-center"
           >
              <Moon size={20} className="text-blue-600" strokeWidth={2.5} />
           </motion.div>
         )}
       </AnimatePresence>
    </button>
  );
}
