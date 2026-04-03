'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import JobCard from '@/components/public/JobCard';
import api from '@/lib/api';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  AlertCircle,
  X,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JobsListPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    q: '',
    state: '',
    jobType: '',
    qualification: '',
    sort: 'newest'
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/jobs', {
        params: {
          page,
          limit: 12,
          status: 'published',
          ...filters
        }
      });
      setJobs(resp.data.data);
      setTotalPages(resp.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, filters.state, filters.jobType, filters.qualification, filters.sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0b] flex flex-col font-sans transition-colors duration-500">
      <Navbar />

      <main className="flex-1 pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-8">
           {/* Page Header */}
           <div className="mb-16 text-center max-w-2xl mx-auto">
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full text-xs font-black text-blue-600 uppercase tracking-widest mb-6"
             >
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                Live Job Engine Active
             </motion.div>
             <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter mb-6">
               Discover Your Next <span className="text-blue-600">Career Milestone</span>
             </h1>
             <p className="text-zinc-500 font-medium text-lg leading-relaxed">
               Search through thousands of verified government job openings across various sectors and states.
             </p>
           </div>

           {/* Search & Filters */}
           <div className="mb-12 bg-zinc-900 dark:bg-zinc-900/40 border border-white/5 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-[-100%] left-[-10%] w-[40%] h-[200%] bg-blue-600/[0.03] rotate-12 pointer-events-none" />
              <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-6 items-center relative z-10">
                 <div className="flex-1 w-full relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Organization, post or department..."
                      value={filters.q}
                      onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 text-white text-lg font-bold placeholder:text-zinc-600 focus:outline-none focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600/40 transition-all duration-300"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black text-white transition-all uppercase tracking-widest shadow-xl">
                      Find Jobs
                    </button>
                 </div>

                 <div className="flex w-full lg:w-auto gap-4">
                    <select 
                      value={filters.jobType}
                      onChange={(e) => handleFilterChange('jobType', e.target.value)}
                      className="flex-1 lg:w-48 bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-zinc-400 font-bold text-sm focus:outline-none cursor-pointer hover:bg-white/[0.08] transition-all appearance-none"
                    >
                      <option value="">Job Type</option>
                      <option value="Central Government">Central Govt</option>
                      <option value="State Government">State Govt</option>
                      <option value="PSU">PSU</option>
                      <option value="Banking">Banking</option>
                      <option value="Defence">Defence</option>
                    </select>
                    
                    <select 
                      value={filters.qualification}
                      onChange={(e) => handleFilterChange('qualification', e.target.value)}
                      className="flex-1 lg:w-48 bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-zinc-400 font-bold text-sm focus:outline-none cursor-pointer hover:bg-white/[0.08] transition-all appearance-none"
                    >
                      <option value="">Qualification</option>
                      <option value="10th Pass">10th Pass</option>
                      <option value="12th Pass">12th Pass</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Graduate">Graduate</option>
                    </select>

                    <button 
                      onClick={() => setFilters({ q: '', state: '', jobType: '', qualification: '', sort: 'newest' })}
                      className="p-5 bg-white/5 hover:bg-red-500/10 border border-white/5 rounded-2xl text-zinc-500 hover:text-red-500 transition-all shadow-xl group/btn"
                    >
                      <X size={24} className="group-hover/btn:rotate-90 transition-transform" />
                    </button>
                 </div>
              </form>
           </div>

           {/* Jobs Listing */}
           <div className="relative min-h-[600px]">
              <AnimatePresence mode="wait">
                 {loading ? (
                    <motion.div 
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                    >
                       <div className="relative">
                          <div className="w-24 h-24 border-8 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-blue-600/10 rounded-full animate-pulse" />
                          </div>
                       </div>
                       <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs">Scanning Database...</p>
                    </motion.div>
                 ) : jobs.length === 0 ? (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-32 text-center"
                    >
                       <AlertCircle size={64} className="text-zinc-200 dark:text-zinc-800 mx-auto mb-8" />
                       <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">No results matched your search</h2>
                       <p className="text-zinc-500 max-w-sm mx-auto mt-4 font-medium">Try broadening your filters or searching for different keywords.</p>
                    </motion.div>
                 ) : (
                    <motion.div 
                      key="list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                       {jobs.map((job) => (
                          <JobCard key={job._id} job={job} />
                       ))}
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* Pagination */}
           {!loading && jobs.length > 0 && (
              <div className="mt-20 flex items-center justify-center gap-6">
                 <button 
                   disabled={page === 1}
                   onClick={() => setPage(p => Math.max(1, p - 1))}
                   className="w-16 h-16 flex items-center justify-center bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl text-zinc-900 dark:text-white shadow-xl shadow-blue-500/5 disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-x-1 transition-all"
                 >
                   <ChevronLeft size={28} />
                 </button>
                 <div className="px-10 py-5 bg-zinc-900 text-white rounded-3xl font-black tracking-widest text-sm shadow-2xl">
                    Page {page} / {totalPages}
                 </div>
                 <button 
                   disabled={page === totalPages}
                   onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                   className="w-16 h-16 flex items-center justify-center bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl text-zinc-900 dark:text-white shadow-xl shadow-blue-500/5 disabled:opacity-30 disabled:cursor-not-allowed hover:translate-x-1 transition-all"
                 >
                   <ChevronRight size={28} />
                 </button>
              </div>
           )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
