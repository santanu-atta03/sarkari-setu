'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, User, ChevronDown, Bell, Globe, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from './NotificationCenter';
import AuthModal from '../auth/AuthModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [locale, setLocale] = useState('en');
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user');
      }
    }

    window.addEventListener('scroll', handleScroll);
    
    if (typeof document !== 'undefined') {
      const isHindi = document.cookie.includes('NEXT_LOCALE=hi');
      setLocale(isHindi ? 'hi' : 'en');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('sarkari_token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  const mainLinks = [
    { name: 'Latest Jobs', href: '/jobs' },
    { name: 'Admit Cards', href: '/admit-cards' },
    { name: 'Results', href: '/results' },
  ];

  const moreLinks = [
    { name: 'Daily Bites', href: '/daily-bites' },
    { name: 'Syllabus', href: '/resources/syllabus' },
    { name: 'Previous Papers', href: '/resources/papers' },
    { name: 'Exam Calendar', href: '/tools/calendar' },
    { name: 'Salary Calculator', href: '/tools/salary' },
  ];

  const mobileLinks = [...mainLinks, ...moreLinks];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'pt-4' : 'pt-6'
      }`}>
        <div className={`mx-auto px-4 md:px-6 transition-all duration-500 ${
          isScrolled ? 'max-w-6xl' : 'max-w-7xl'
        }`}>
          <div className={`relative flex items-center justify-between px-6 py-3 transition-all duration-500 rounded-2xl border ${
            isScrolled 
              ? 'bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-2xl border-black/5 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]' 
              : 'bg-white/40 dark:bg-white/5 backdrop-blur-md border-transparent'
          }`}>
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold overflow-hidden shadow-lg shadow-blue-500/20">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-blue-400"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                />
                <span className="relative z-10 text-xl font-black">S</span>
              </div>
              <span className="hidden sm:block text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
                Sarkari<span className="text-blue-600">Setu</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {mainLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="relative">
                <button 
                  onMouseEnter={() => setIsResourcesOpen(true)}
                  onMouseLeave={() => setIsResourcesOpen(false)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  More <ChevronDown size={14} className={`transition-transform duration-300 ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isResourcesOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      onMouseEnter={() => setIsResourcesOpen(true)}
                      onMouseLeave={() => setIsResourcesOpen(false)}
                      className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#0f0f11] border border-black/5 dark:border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-3xl overflow-hidden"
                    >
                      {moreLinks.map((link) => (
                        <Link 
                          key={link.name} 
                          href={link.href}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl transition-all"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const query = (e.currentTarget.elements.namedItem('nav-search') as HTMLInputElement).value;
                  if (query.trim()) window.location.href = `/jobs?q=${encodeURIComponent(query)}`;
                }}
                className="hidden xl:flex relative group"
              >
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                 <input 
                   name="nav-search"
                   type="text" 
                   placeholder="Search opportunities..." 
                   className="pl-10 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-transparent focus:border-blue-500/30 focus:bg-white dark:focus:bg-zinc-900 rounded-xl text-xs font-semibold focus:outline-none transition-all w-32 xl:w-48 focus:xl:w-64"
                 />
              </form>

              <div className="flex items-center gap-1.5 md:gap-2">
                <button
                  onClick={() => {
                    const nextLocale = locale === 'hi' ? 'en' : 'hi';
                    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
                    setLocale(nextLocale);
                    window.location.reload();
                  }}
                  className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-all text-zinc-600 dark:text-zinc-400 font-bold"
                  title="Change Language"
                >
                  <Globe size={18} className="md:mr-1 lg:hidden xl:block" />
                  <span className="hidden lg:block text-xs">{locale === 'hi' ? 'HI' : 'EN'}</span>
                </button>
                
                <ThemeToggle />
                
                <div className="h-6 w-px bg-black/10 dark:bg-white/10 mx-1 hidden sm:block" />
                
                {user ? (
                  <div className="flex items-center gap-3">
                    <NotificationCenter />
                    <div className="relative">
                      <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="w-10 h-10 rounded-full border-2 border-transparent hover:border-blue-600 transition-all overflow-hidden p-0.5 bg-zinc-100 dark:bg-white/5"
                      >
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white">
                            <User size={18} />
                          </div>
                        )}
                      </button>

                      <AnimatePresence>
                        {isUserMenuOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-[#0f0f11] border border-black/5 dark:border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-3xl overflow-hidden z-[101]"
                          >
                            <div className="px-4 py-3 border-b border-black/5 dark:border-white/5">
                              <p className="text-xs font-bold text-zinc-400 truncate">Signed in as</p>
                              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{user.name}</p>
                            </div>
                            <div className="p-1">
                              <Link 
                                href="/dashboard"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl transition-all"
                              >
                                <LayoutDashboard size={16} />
                                Dashboard
                              </Link>
                              <Link 
                                href="/dashboard/profile"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl transition-all"
                              >
                                <User size={16} />
                                My Profile
                              </Link>
                              <div className="h-px bg-black/5 dark:bg-white/5 my-1" />
                              <button 
                                onClick={handleSignOut}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                              >
                                <LogOut size={16} />
                                Sign Out
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95 shrink-0"
                  >
                    <span>Sign In</span>
                  </button>
                )}
                
                <button 
                   onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                   className="p-2 lg:hidden text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mx-auto px-4 md:px-6 mt-2 overflow-hidden"
            >
              <div className="bg-white dark:bg-[#0a0a0b] border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-3xl flex flex-col gap-2">
                {mobileLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className="flex items-center py-4 px-4 text-lg font-bold text-zinc-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="h-px bg-black/5 dark:bg-white/5 my-2" />
                
                {user ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="flex items-center py-4 px-4 text-lg font-bold text-zinc-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/dashboard/profile" 
                      className="flex items-center py-4 px-4 text-lg font-bold text-zinc-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <div className="h-px bg-black/5 dark:bg-white/5 my-2" />
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-3 w-full py-4 text-red-500 font-bold text-lg hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                    >
                      <LogOut size={20} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }} 
                    className="w-full py-4 bg-blue-600 text-white rounded-xl text-center font-bold text-lg shadow-xl shadow-blue-600/20"
                  >
                    Sign In
                  </button>
                )}
              </div>
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
