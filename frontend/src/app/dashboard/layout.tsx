'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  LayoutDashboard, 
  Briefcase, 
  UserCircle, 
  Settings,
  Bell,
  ChevronRight
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('sarkari_token');
    if (!token) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return null;

  const navLinks = [
    { name: 'Recommended Jobs', href: '/dashboard', icon: Sparkles },
    { name: 'My Applications', href: '/dashboard/applications', icon: Briefcase },
    { name: 'Aspirant Profile', href: '/dashboard/profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0b] transition-colors duration-500">
      {/* Background Grid & Blurs from Home Theme */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0" />
      <div className="fixed top-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <Navbar />

      <div className="flex flex-col lg:flex-row relative z-10 pt-28 lg:pt-32 pb-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 gap-8">
        {/* Modern Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-32 space-y-4">
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-[32px] p-6 shadow-xl">
              <div className="mb-8 px-2">
                <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Workspace</h2>
                <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">My Dashboard</p>
              </div>
              
              <nav className="space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`group flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon size={20} className={isActive ? 'text-white' : 'text-zinc-400 group-hover:text-blue-500'} />
                        <span className="text-sm tracking-tight">{link.name}</span>
                      </div>
                      {isActive && <ChevronRight size={16} />}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 space-y-2">
                 <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 p-4 rounded-2xl text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    <Settings size={20} className="text-zinc-400" />
                    Account Settings
                  </Link>
              </div>
            </div>

            {/* Quick Tip / Support Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-black rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-600/40 transition-colors" />
               <h3 className="text-lg font-black tracking-tighter mb-2 relative z-10 text-white">Need Help?</h3>
               <p className="text-xs text-zinc-400 font-medium mb-4 relative z-10 leading-relaxed">Our support team is available 24/7 to help you with your applications.</p>
               <button className="text-[10px] font-black uppercase tracking-widest px-6 py-2.5 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all relative z-10 shadow-lg">Contact Us</button>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 w-full min-w-0">
          <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-[40px] p-8 lg:p-12 shadow-2xl min-h-[70vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
