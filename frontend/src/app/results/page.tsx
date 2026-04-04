'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import JobCard from '@/components/public/JobCard';
import api from '@/lib/api';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  FilterX,
  MapPin,
  AlertCircle,
  Loader2,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12,
    sort: searchParams.get('sort') || 'newest',
    state: searchParams.get('state') || '',
    q: searchParams.get('q') || '',
    status: 'published',
    hasResult: 'true'
  });

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const states = ['All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

  useEffect(() => {
    setFilters({
      page: parseInt(searchParams.get('page') || '1'),
      limit: 12,
      sort: searchParams.get('sort') || 'newest',
      state: searchParams.get('state') || '',
      q: searchParams.get('q') || '',
      status: 'published',
      hasResult: 'true'
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams: any = { ...filters };
        if (!queryParams.state || queryParams.state === 'All India') delete queryParams.state;
        if (!queryParams.q) delete queryParams.q;

        const resp = await api.get('/jobs', { params: queryParams });
        if (resp.data.success) {
          setJobs(resp.data.data);
          setTotalJobs(resp.data.pagination.total);
          setTotalPages(resp.data.pagination.totalPages);
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [filters]);

  const updateURL = (newFilters: any) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '1' && key !== 'limit' && key !== 'status' && key !== 'hasResult') {
         if (typeof value === 'string' && value.includes('All')) return;
         params.set(key, String(value));
      }
    });
    router.push(`/results?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      page: 1,
      limit: 12,
      sort: 'newest',
      state: '',
      q: '',
      status: 'published',
      hasResult: 'true'
    };
    updateURL(newFilters);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0b] transition-colors duration-500">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-8xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">
              Exam <span className="text-green-600">Results</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-8 h-[2px] bg-green-600 rounded-full" />
              Check your performance in {totalJobs} recent competitive exams
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search exam/board..." 
                  className="pl-12 pr-6 py-4 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all w-full md:w-64"
                  value={filters.q}
                  onChange={(e) => setFilters({...filters, q: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && updateURL(filters)}
                />
             </div>
             
             <button 
               onClick={() => setIsFilterSidebarOpen(true)}
               className="md:hidden p-4 bg-green-600 text-white rounded-2xl shadow-xl shadow-green-500/20"
             >
                <SlidersHorizontal size={20} />
             </button>
             
             <select 
                className="hidden md:block py-4 px-6 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl text-sm font-bold focus:outline-none transition-all cursor-pointer"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
             >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="views">Sort: Most Popular</option>
             </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="hidden lg:block w-72 shrink-0 space-y-10">
            <div className="sticky top-32 space-y-10">
               <div>
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                       <MapPin size={14} className="text-green-600" /> Filter by State
                    </h3>
                    <button onClick={clearFilters} className="text-[10px] font-black text-green-600 uppercase tracking-widest hover:underline">Clear</button>
                 </div>
                 <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-1 pr-2">
                    {states.map((st) => (
                       <button
                         key={st}
                         onClick={() => handleFilterChange('state', st)}
                         className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                             (filters.state === st || (st === 'All India' && !filters.state)) 
                             ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                             : 'text-zinc-500 hover:bg-black/5 dark:hover:bg-white/5'
                         }`}
                       >
                         {st}
                       </button>
                    ))}
                 </div>
               </div>

               <div className="p-8 bg-green-600/10 border border-green-600/20 rounded-[32px] overflow-hidden relative group">
                  <div className="relative z-10 text-center">
                     <Trophy className="text-green-600 mx-auto mb-4" size={32} />
                     <h4 className="text-lg font-black uppercase tracking-tighter leading-tight mb-2 dark:text-white">Success Stories</h4>
                     <p className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-widest mb-6 leading-relaxed">Join 10,000+ candidates who found their dream job via SarkariSetu.</p>
                     <button className="w-full py-3 bg-green-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-600/20">View Hall of Fame</button>
                  </div>
               </div>
            </div>
          </aside>

          <div className="flex-1">
            <AnimatePresence mode='wait'>
              {loading ? (
                <motion.div 
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {[1,2,3,4,5,6].map((i) => (
                    <div key={i} className="h-[400px] bg-white dark:bg-zinc-900/40 rounded-[32px] border border-black/5 animate-pulse" />
                  ))}
                </motion.div>
              ) : error ? (
                 <motion.div 
                   key="error"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex flex-col items-center justify-center py-32 text-center"
                 >
                    <AlertCircle size={64} className="text-red-500 mb-6" />
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">System Error</h3>
                    <p className="text-zinc-500 font-medium max-w-xs mt-2">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-black uppercase tracking-widest text-[10px]">Try Refresh</button>
                 </motion.div>
              ) : jobs.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-32 text-center"
                >
                   <div className="w-24 h-24 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[40px] flex items-center justify-center mb-8 shadow-2xl">
                      <FilterX size={40} className="text-zinc-300" />
                   </div>
                   <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">No Results Found</h3>
                   <p className="text-zinc-500 font-medium max-w-sm mt-2">No active results are available for the selected criteria at this moment.</p>
                   <button onClick={clearFilters} className="mt-8 px-10 py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-green-500/20 hover:scale-105 active:scale-95 transition-all">Clear All Filters</button>
                </motion.div>
              ) : (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {!loading && totalPages > 1 && (
              <div className="mt-20 flex items-center justify-center gap-3">
                 <button 
                   disabled={filters.page === 1}
                   onClick={() => handleFilterChange('page', String(filters.page - 1))}
                   className="w-14 h-14 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl flex items-center justify-center text-zinc-900 dark:text-white hover:bg-green-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white transition-all shadow-xl shadow-green-500/5 group"
                 >
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                 </button>
                 
                 <div className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-500/5">
                    <span className="text-green-600">{filters.page}</span>
                    <span className="opacity-20">/</span>
                    <span>{totalPages}</span>
                 </div>

                 <button 
                   disabled={filters.page === totalPages}
                   onClick={() => handleFilterChange('page', String(filters.page + 1))}
                   className="w-14 h-14 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl flex items-center justify-center text-zinc-900 dark:text-white hover:bg-green-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white transition-all shadow-xl shadow-green-500/5 group"
                 >
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      
      <AnimatePresence>
        {isFilterSidebarOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsFilterSidebarOpen(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
            />
            <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-[#0a0a0b] z-[200] p-10 overflow-y-auto"
            >
               <div className="flex items-center justify-between mb-12">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">Filters</h2>
                  <button onClick={() => setIsFilterSidebarOpen(false)} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center"><FilterX size={20} /></button>
               </div>
               
               <div className="space-y-12">
                  <div>
                    <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">Select State</h3>
                    <select 
                      className="w-full p-5 bg-zinc-50 dark:bg-zinc-900 border border-black/5 rounded-2xl font-bold"
                      value={filters.state}
                      onChange={(e) => { handleFilterChange('state', e.target.value); setIsFilterSidebarOpen(false); }}
                    >
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <button 
                    onClick={() => { clearFilters(); setIsFilterSidebarOpen(false); }}
                    className="w-full py-5 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 font-black uppercase tracking-widest text-[10px]"
                  >
                    Reset All Filters
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34, 197, 94, 0.5); }
      `}</style>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0b]">
           <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
              <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Initializing Engine...</p>
           </div>
       </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
