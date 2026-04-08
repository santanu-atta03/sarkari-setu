'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from './NotificationCenter';
import AuthModal from '../auth/AuthModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user');
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('sarkari_token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  const navLinks = [
    { name: 'Latest Jobs', href: '/jobs' },
    { name: 'Daily Bites', href: '/daily-bites' },
    { name: 'Resources', href: '/resources' },
    { name: 'Tools', href: '/tools' },
    { name: 'Admit Cards', href: '/admit-cards' },
    { name: 'Results', href: '/results' },
    { name: 'Trending Now', href: '/jobs?sort=trending' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'py-4 bg-white/70 dark:bg-[#0a0a0b]/70 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 shadow-2xl shadow-blue-500/5' : 'py-8 bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform shadow-lg shadow-blue-600/30">
              S
            </div>
            <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase transition-colors">
              Sarkari<span className="text-blue-600 group-hover:text-blue-500 transition-colors">Setu</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const query = (e.currentTarget.elements.namedItem('nav-search') as HTMLInputElement).value;
                if (query.trim()) window.location.href = `/jobs?q=${encodeURIComponent(query)}`;
              }}
              className="hidden md:flex relative group"
            >
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={16} />
               <input 
                 name="nav-search"
                 type="text" 
                 placeholder="Search registry..." 
                 className="pl-10 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-zinc-900 rounded-xl text-xs font-bold focus:outline-none transition-all w-32 lg:w-44 focus:lg:w-64"
               />
            </form>

            <button
              onClick={() => {
                const nextLocale = document.cookie.includes('NEXT_LOCALE=hi') ? 'en' : 'hi';
                document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
                window.location.reload();
              }}
              className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-zinc-600 dark:text-zinc-400 focus:outline-none focus:ring-2 ring-blue-500/20 font-black"
            >
              {document.cookie.includes('NEXT_LOCALE=hi') ? 'अ' : 'A'}
            </button>
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white overflow-hidden shadow-lg border-2 border-white dark:border-zinc-800">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <button 
                  onClick={handleSignOut}
                  className="hidden md:block text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:flex px-6 py-2.5 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                Sign In
              </button>
            )}
            
            <button 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="p-2 md:hidden text-zinc-900 dark:text-white"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-black/5 dark:border-white/10 p-8 flex flex-col gap-6 md:hidden shadow-2xl"
            >
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tighter" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <button 
                  onClick={handleSignOut}
                  className="w-full py-4 bg-zinc-100 dark:bg-white/5 text-red-500 rounded-2xl text-center font-bold text-lg"
                >
                  Sign Out
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }} 
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl text-center font-bold text-lg shadow-xl shadow-blue-900/20"
                >
                  Sign In
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
