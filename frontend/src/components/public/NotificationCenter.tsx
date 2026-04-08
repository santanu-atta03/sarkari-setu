'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Info, Zap, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'urgent' | 'update';
  isRead: boolean;
  time: string;
  link?: string;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'UPSC CSE 2026',
      message: 'New application window is now open for candidates.',
      type: 'urgent',
      isRead: false,
      time: '2 mins ago',
      link: '/jobs/upsc-civil-services-2026'
    },
    {
      id: '2',
      title: 'SSC CGL Results',
      message: 'Tier-1 results have been announced. Check now!',
      type: 'update',
      isRead: false,
      time: '1 hour ago',
      link: '/results'
    },
    {
      id: '3',
      title: 'System Update',
      message: 'We have optimized the mobile experience for you.',
      type: 'info',
      isRead: true,
      time: '1 day ago'
    }
  ]);

  const hasUnread = notifications.some(n => !n.isRead);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-900 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/5 group"
      >
        <Bell size={20} className={hasUnread ? 'animate-bounce-slow' : ''} />
        {hasUnread && (
          <span className="absolute top-2 right-2 w-3 h-3 bg-red-600 border-2 border-white dark:border-black rounded-full shadow-lg shadow-red-600/40 animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-96 bg-white dark:bg-[#16161a] border border-black/5 dark:border-white/10 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden z-50 backdrop-blur-3xl"
          >
            <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/40">
               <div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Notifications</h3>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-tight">Registry Updates & Alerts</p>
               </div>
               {hasUnread && (
                 <button 
                   onClick={markAllAsRead}
                   className="p-2 hover:bg-blue-600/10 rounded-lg text-blue-600 transition-colors group"
                   title="Mark all as read"
                 >
                   <Check size={18} className="group-hover:scale-110 transition-transform" />
                 </button>
               )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-black/5 dark:divide-white/5">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-6 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors relative group ${!notif.isRead ? 'bg-blue-600/[0.02]' : ''}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      {!notif.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                      )}
                      
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                          notif.type === 'urgent' ? 'bg-red-600/10 text-red-600' :
                          notif.type === 'update' ? 'bg-blue-600/10 text-blue-600' :
                          'bg-zinc-600/10 text-zinc-600'
                        }`}>
                          {notif.type === 'urgent' ? <Zap size={18} /> : 
                           notif.type === 'update' ? <Calendar size={18} /> : 
                           <Info size={18} />}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-black uppercase tracking-tight ${!notif.isRead ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-zinc-400 font-bold tracking-tighter whitespace-nowrap">{notif.time}</span>
                          </div>
                          <p className={`text-xs leading-relaxed ${!notif.isRead ? 'text-zinc-600 dark:text-zinc-400 font-medium' : 'text-zinc-500'}`}>
                            {notif.message}
                          </p>
                          
                          {notif.link && (
                            <Link 
                              href={notif.link}
                              className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:gap-2 transition-all"
                            >
                              Explore Now <ArrowRight size={12} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-3xl flex items-center justify-center text-zinc-300 dark:text-zinc-800 mx-auto mb-6">
                    <Bell size={32} />
                  </div>
                  <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">All clear</p>
                  <p className="text-zinc-400 text-[10px] mt-1 font-bold">No new notifications for now.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/40 border-t border-black/5 dark:border-white/5 flex gap-4">
               <button className="flex-1 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all">
                  Registry History
               </button>
               <button 
                 onClick={() => setIsOpen(false)}
                 className="w-12 h-12 bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 rounded-2xl flex items-center justify-center text-zinc-500 hover:text-red-500 transition-colors"
               >
                 <X size={20} />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
