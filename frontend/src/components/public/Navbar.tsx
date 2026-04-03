'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Bell, Landmark, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    { name: 'Trending', href: '/jobs?sort=trending' },
    { name: 'State Jobs', href: '/jobs?type=state' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled ? 'py-4 bg-white/70 dark:bg-black/70 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 shadow-2xl shadow-blue-500/5' : 'py-8 bg-transparent'
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
        <div className="hidden md:flex items-center gap-10">
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

        <div className="flex items-center gap-4">
          <Link 
             href="/admin/login" 
             className="hidden md:flex px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/10 active:scale-95"
          >
            Admin Access
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
