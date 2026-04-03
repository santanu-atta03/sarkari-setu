'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Bell,
  Search,
  User as UserIcon,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('sarkari_token');
    const userStr = localStorage.getItem('admin_user');
    
    if (!token || !userStr) {
      if (pathname !== '/admin/login') {
        router.replace('/admin/login');
      } else {
        setIsAdmin(false);
      }
      return;
    }

    try {
      setAdminUser(JSON.parse(userStr));
      setIsAdmin(true);
      if (pathname === '/admin/login') {
        router.replace('/admin/dashboard');
      }
    } catch (e) {
      localStorage.removeItem('sarkari_token');
      localStorage.removeItem('admin_user');
      router.replace('/admin/login');
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('sarkari_token');
    localStorage.removeItem('admin_user');
    router.replace('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Manage Jobs', icon: Briefcase, href: '/admin/jobs' },
    { name: 'Create Post', icon: PlusCircle, href: '/admin/jobs/new' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Login page doesn't get the dashboard layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-200 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[#121214] border-r border-white/5 flex flex-col h-screen sticky top-0 z-50 transition-all duration-300"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                <span className="font-bold text-xl tracking-tight text-white uppercase">Sarkari<span className="text-blue-500">Setu</span></span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
                {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.name}</span>}
                {isActive && isSidebarOpen && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          {isSidebarOpen && adminUser && (
            <div className="flex items-center gap-3 px-2 py-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                {adminUser.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{adminUser.name}</p>
                <p className="text-xs text-gray-500 truncate">{adminUser.role?.replace('_', ' ')}</p>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 group ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Logout System</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 bg-[#0a0a0b]/80 backdrop-blur-md flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="hidden md:flex relative group ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all relative group border border-white/5">
              <Bell className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0a0b]" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-[#16161a] border border-white/10 flex items-center justify-center group hover:border-blue-500/50 cursor-pointer transition-all">
              <UserIcon className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 scroll-smooth bg-[#0a0a0b]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
