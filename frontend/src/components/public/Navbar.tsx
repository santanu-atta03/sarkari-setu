'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Bell, Landmark, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Latest Jobs', href: '/jobs' },
    { name: 'Eligibility', href: '/eligibility' },
    { name: 'Admit Cards', href: '/admit-cards' },
    { name: 'Results', href: '/results' },
    { name: 'Trending Now', href: '/jobs?sort=trending' },
  ];

  return (
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

        <div className="flex items-center gap-5">
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
               className="pl-10 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-zinc-900 rounded-xl text-xs font-bold focus:outline-none transition-all w-44 focus:w-64"
             />
          </form>

          <ThemeToggle />
          
          <Link 
             href="/admin/login" 
             className="hidden md:flex px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/10 active:scale-95"
          >
            Admin 
          </Link>
          
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
            <Link href="/admin/login" className="w-full py-4 bg-blue-600 text-white rounded-2xl text-center font-bold text-lg shadow-xl shadow-blue-900/20">
              Admin Console
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
