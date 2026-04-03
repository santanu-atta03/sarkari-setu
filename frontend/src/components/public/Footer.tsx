'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Globe, Share2, ExternalLink, Landmark, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const categories = [
    { name: 'Central Govt Jobs', href: '/jobs?type=central' },
    { name: 'State Govt Jobs', href: '/jobs?type=state' },
    { name: 'Railway Recruit', href: '/jobs?category=railway' },
    { name: 'Banking Sector', href: '/jobs?category=banking' },
    { name: 'Defence & Police', href: '/jobs?category=defence' },
  ];

  const quickLinks = [
    { name: 'About SarkariSetu', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Contact Support', href: '/contact' },
    { name: 'Admin Dashboard', href: '/admin/login' },
  ];

  return (
    <footer className="bg-white dark:bg-[#0a0a0b] border-t border-black/5 dark:border-white/5 py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/[0.02] -skew-x-12 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform shadow-lg shadow-blue-600/30">
              S
            </div>
            <span className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase transition-colors">
              Sarkari<span className="text-blue-600">Setu</span>
            </span>
          </Link>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xs font-medium">
            Empowering the Indian youth with transparent, real-time government job updates and a seamless application experience.
          </p>
          <div className="flex gap-4">
             {[Globe, Share2, ExternalLink, Mail].map((Icon, i) => (
                <button key={i} className="w-12 h-12 flex items-center justify-center bg-zinc-900 dark:bg-white/5 rounded-2xl text-white dark:text-gray-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all shadow-xl hover:-translate-y-1">
                  <Icon size={20} />
                </button>
             ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-10">By Category</h4>
          <ul className="space-y-5">
            {categories.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="text-sm font-bold text-zinc-500 hover:text-blue-600 dark:hover:text-white transition-all">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-10">Resource Hub</h4>
          <ul className="space-y-5">
            {quickLinks.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="text-sm font-bold text-zinc-500 hover:text-blue-600 dark:hover:text-white transition-all">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-1">
           <div className="p-8 bg-zinc-900 dark:bg-white/5 rounded-[40px] border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <Landmark size={80} className="text-blue-600" />
              </div>
              <h4 className="text-xl font-black text-white mb-4 relative z-10">Verified Updates</h4>
              <p className="text-xs font-bold text-zinc-400 mb-8 leading-relaxed relative z-10">
                Receive directly verified notifications from government portals. No spam, just pure opportunities.
              </p>
              <div className="relative z-10 flex items-center gap-3">
                 <ShieldCheck className="text-green-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/50 underline decoration-green-500/50 decoration-2">Gov Cert Source Engine</span>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-24 pt-12 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-500 dark:text-zinc-600 text-xs font-bold uppercase tracking-widest">
         <p>&copy; 2026 SarkariSetu. All rights reserved.</p>
         <div className="flex items-center gap-2">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> by <span className="text-zinc-900 dark:text-white">Santanu Atta</span>
         </div>
      </div>
    </footer>
  );
}
