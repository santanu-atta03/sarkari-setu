'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import JobCard from '@/components/public/JobCard';
import api from '@/lib/api';
import { 
  Search, 
  TrendingUp, 
  MapPin, 
  Landmark, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Users, 
  FileText,
  Star,
  Globe,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [trendingJobs, setTrendingJobs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const resp = await api.get('/jobs', {
          params: { limit: 6, status: 'published', isTrending: true }
        });
        setTrendingJobs(resp.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { name: 'UPSC', icon: Landmark, count: '124+', color: 'bg-orange-500' },
    { name: 'SSC', icon: ShieldCheck, count: '450+', color: 'bg-blue-600' },
    { name: 'Railway', icon: Zap, count: '820+', color: 'bg-yellow-500' },
    { name: 'Banking', icon: Landmark, count: '310+', color: 'bg-green-600' },
    { name: 'Defence', icon: ShieldCheck, count: '215+', color: 'bg-red-600' },
    { name: 'Police', icon: Users, count: '540+', color: 'bg-indigo-600' },
  ];

  const stats = [
    { label: 'Active Jobs', value: '4,500+', icon: FileText },
    { label: 'Daily Visitors', value: '25K+', icon: Users },
    { label: 'States Covered', value: '28', icon: Globe },
    { label: 'Verified Sources', value: '100%', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0b] transition-colors duration-500">
      <Navbar />

      <main>
        {/* Futuristic Hero Section */}
        <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden">
           {/* Background Grid & Blurs */}
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />
           <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
           <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
           
           <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
              <div className="max-w-4xl">
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-xs font-black text-blue-600 uppercase tracking-widest mb-10 shadow-xl shadow-blue-600/5 hover:scale-105 transition-all cursor-default"
                 >
                    <Sparkles size={16} /> Empowering the next generation of civil servants
                 </motion.div>
                 
                 <motion.h1 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 }}
                   className="text-6xl md:text-8xl font-black text-zinc-900 dark:text-white tracking-tighter leading-[0.95] mb-10"
                 >
                    India's Most Trusted <br />
                    <span className="text-blue-600 relative">
                       Govt Job Portal
                       <div className="absolute -bottom-2 left-0 w-full h-4 bg-blue-600/10 -skew-x-12 -z-10" />
                    </span>
                 </motion.h1>

                 <motion.p 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   className="text-xl md:text-2xl text-zinc-500 font-medium leading-relaxed max-w-2xl mb-14"
                 >
                    Get instant, verified updates from 1,000+ government departments. 
                    Real-time notifications, direct apply links, and comprehensive preparation resources.
                 </motion.p>

                 <motion.form 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 }}
                   onSubmit={handleSearch}
                   className="flex flex-col md:flex-row gap-4 p-3 bg-zinc-900 dark:bg-zinc-900/60 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl shadow-blue-600/10 group focus-within:ring-4 focus-within:ring-blue-600/20 transition-all duration-500"
                 >
                    <div className="flex-1 flex items-center px-6 gap-4">
                       <Search className="text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={24} />
                       <input 
                         type="text" 
                         placeholder="E.g. SSC CGL 2026, Delhi Police, Railway MTS..." 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="flex-1 bg-transparent border-none text-white text-lg font-bold placeholder:text-zinc-700 focus:outline-none transition-all py-4"
                       />
                    </div>
                    <button 
                       type="submit"
                       className="md:w-56 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[32px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
                    >
                       Start Search <ArrowRight size={18} />
                    </button>
                 </motion.form>

                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 flex flex-wrap items-center gap-8 text-zinc-500 font-bold uppercase tracking-widest text-[10px]"
                 >
                    <span>Popular Searches:</span>
                    <Link href="/jobs?q=ssc" className="hover:text-blue-600 transition-colors">#SSC_CGL</Link>
                    <Link href="/jobs?q=upsc" className="hover:text-blue-600 transition-colors">#UPSC_CSAT</Link>
                    <Link href="/jobs?q=bank" className="hover:text-blue-600 transition-colors">#IBPS_PO</Link>
                    <Link href="/jobs?q=railway" className="hover:text-blue-600 transition-colors">#RRB_ALP</Link>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/20 relative">
           <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
              {stats.map((stat, i) => (
                <div key={i} className="text-center md:text-left space-y-2 group">
                   <div className="w-12 h-12 bg-blue-600/5 dark:bg-white/5 rounded-2xl flex items-center justify-center text-blue-600 mx-auto md:mx-0 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                      <stat.icon size={24} />
                   </div>
                   <p className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{stat.value}</p>
                   <p className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Category Grid */}
        <section className="py-32">
           <div className="max-w-7xl mx-auto px-8">
              <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 text-center md:text-left">
                 <div>
                    <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter">Browse by Category</h2>
                    <p className="text-zinc-500 mt-4 text-lg font-medium">Segmented job listings for easier discovery.</p>
                 </div>
                 <Link href="/jobs" className="px-8 py-4 border border-black/5 dark:border-white/5 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl">
                   View All Archives
                 </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                 {categories.map((cat, i) => (
                    <motion.div
                       key={cat.name}
                       whileHover={{ y: -10 }}
                       className="group p-8 bg-zinc-50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 rounded-[40px] text-center hover:bg-white dark:hover:bg-zinc-900 hover:shadow-2xl hover:shadow-blue-600/5 hover:border-blue-500/20 transition-all cursor-pointer"
                       onClick={() => router.push(`/jobs?q=${cat.name.toLowerCase()}`)}
                    >
                       <div className={`w-16 h-16 ${cat.color} rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl group-hover:rotate-12 transition-transform`}>
                          <cat.icon size={32} />
                       </div>
                       <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">{cat.name}</h3>
                       <p className="mt-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                          {cat.count} listings
                       </p>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Trending Jobs Section */}
        <section className="py-32 bg-[#0a0a0b] relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-blue-600/[0.03] pointer-events-none" />
           <div className="max-w-7xl mx-auto px-8 relative z-10">
              <div className="flex items-center justify-between mb-20">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/40 rotate-12">
                       <TrendingUp size={32} strokeWidth={3} />
                    </div>
                    <div>
                       <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">Global Trending</h2>
                       <p className="text-zinc-500 mt-2 font-bold uppercase tracking-widest text-xs">Based on real-time application metrics</p>
                    </div>
                 </div>
                 <Link href="/jobs?sort=trending" className="hidden md:flex items-center gap-2 group text-blue-500 font-black uppercase tracking-widest text-xs">
                    View Trending Full Map <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 <AnimatePresence>
                    {loading ? (
                       [1,2,3].map((i) => (
                          <div key={i} className="h-80 bg-white/5 rounded-[32px] animate-pulse" />
                       ))
                    ) : (
                       trendingJobs.map((job) => (
                          <JobCard key={job._id} job={job} />
                       ))
                    )}
                 </AnimatePresence>
              </div>
              
              {!loading && trendingJobs.length === 0 && (
                <div className="py-20 text-center">
                   <p className="text-zinc-600 font-black uppercase tracking-widest text-sm">No trending items in the current cycle.</p>
                </div>
              )}
           </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-40">
           <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="relative">
                 <div className="absolute inset-0 bg-blue-600/10 blur-[120px] -z-10" />
                 <div className="grid grid-cols-2 gap-6 relative">
                    <div className="space-y-6 pt-12">
                       <div className="aspect-square bg-zinc-900 rounded-[40px] flex items-center justify-center p-12 border border-white/10 group hover:border-blue-500/50 transition-all shadow-2xl">
                          <ShieldCheck size={64} className="text-blue-500 group-hover:scale-110 transition-transform" />
                       </div>
                       <div className="aspect-square bg-zinc-50 rounded-[40px] flex items-center justify-center p-12 border border-black/5 group hover:border-blue-600/50 transition-all shadow-2xl">
                          <Zap size={64} className="text-zinc-900 group-hover:scale-110 transition-transform" />
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="aspect-square bg-blue-600 rounded-[40px] flex items-center justify-center p-12 shadow-2xl group hover:scale-105 transition-all">
                          <Star size={64} className="text-white fill-white group-hover:rotate-12 transition-transform" />
                       </div>
                       <div className="aspect-square bg-zinc-900 rounded-[40px] flex items-center justify-center p-12 border border-white/10 group hover:border-blue-500/50 transition-all shadow-2xl">
                          <Users size={64} className="text-zinc-500 group-hover:text-white transition-all" />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-12">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-0.5 bg-blue-600" />
                    <span className="text-xs font-black text-blue-600 uppercase tracking-[0.4em]">Integrated Intelligence</span>
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter leading-[0.9] mb-12">
                   Engineered for Your Success Journey.
                 </h2>
                 <p className="text-xl text-zinc-500 font-medium leading-relaxed mb-12">
                    SarkariSetu isn't just a job portal; it's a dedicated engine designed to save you time and eliminate the complexity of searching for government opportunities.
                 </p>
                 <div className="space-y-8">
                    {[
                      { icon: ShieldCheck, title: 'Direct Verification', desc: 'Every listing is cross-checked with the official Gazette of India and state portals.' },
                      { icon: Zap, title: 'Instant Alert Engine', desc: 'Be the first to know about new vacancies with our low-latency notification system.' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6">
                         <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-lg">
                            <item.icon size={24} />
                         </div>
                         <div>
                            <h4 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">{item.title}</h4>
                            <p className="text-zinc-500 mt-1 font-medium">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="mt-8 px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-600/10">
                    Join 50K+ Aspirants
                 </button>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
