'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/jobs', {
        params: {
          page,
          limit: 10,
          q: searchTerm,
          status: statusFilter
        }
      });
      setJobs(resp.data.data);
      setTotalPages(resp.data.pagination.totalPages);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const deleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this job post? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      alert('Failed to delete job post.');
    }
  };

  const toggleStatus = async (job: any) => {
    try {
      const newStatus = job.status === 'published' ? 'draft' : 'published';
      await api.patch(`/jobs/${job._id}`, { status: newStatus });
      fetchJobs();
    } catch (err) {
      alert('Failed to toggle status.');
    }
  };

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Active Recruitment</h1>
          <p className="text-gray-400 mt-2 text-lg">Detailed management console for job postings</p>
        </div>
        <button 
          onClick={() => router.push('/admin/jobs/new')}
          className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40 transition-all transform active:scale-95"
        >
          <Plus className="w-5 h-5" /> Generate Post
        </button>
      </div>

      {/* Filters Backdrop */}
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-[-100%] left-[-10%] w-[40%] h-[200%] bg-blue-500/[0.03] rotate-12 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row gap-6 items-center relative z-10">
          <form onSubmit={handleSearch} className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Query by title, organization or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0b]/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all uppercase tracking-widest border border-white/5">
              Search Engine
            </button>
          </form>

          <div className="flex w-full lg:w-auto gap-4">
            <div className="flex-1 lg:flex-none relative min-w-[200px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-[#0a0a0b]/40 border border-white/10 rounded-2xl py-4 pl-10 pr-10 text-white text-sm focus:outline-none transition-all cursor-pointer"
              >
                <option value="">Status: All Engine</option>
                <option value="published">Published</option>
                <option value="draft">Drafts Only</option>
                <option value="archived">Archived</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            </div>
            
            <button 
              onClick={() => {setSearchTerm(''); setStatusFilter(''); setPage(1);}}
              className="p-4 bg-white/5 hover:bg-red-500/10 border border-white/5 rounded-2xl text-gray-500 hover:text-red-400 transition-all"
              title="Reset Filters"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Grid/Table */}
      <div className="bg-[#121214] border border-white/5 rounded-[40px] shadow-2xl overflow-hidden min-h-[500px] relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-[#121214]/50 backdrop-blur-sm z-30"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-600/10 rounded-full animate-pulse" />
                  </div>
                </div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Synchronizing Core...</p>
              </div>
            </motion.div>
          ) : jobs.length === 0 ? (
            <motion.div 
               key="empty"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-32 text-center"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-600 mx-auto mb-8">
                <AlertCircle className="w-10 h-10" />
              </div>
              <p className="text-2xl font-bold text-gray-500">No matching job posts found</p>
              <p className="text-gray-600 mt-2">Adjust your search parameters or generate a new listing.</p>
              <button 
                 onClick={() => {setSearchTerm(''); setStatusFilter('');}}
                 className="mt-8 px-8 py-3.5 bg-white/5 hover:bg-white/10 rounded-2xl text-white font-bold transition-all border border-white/5"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-gray-600">Position Integrity</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-gray-600">Metric Output</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-gray-600 text-center">Lifecycle</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-gray-600 text-right">Direct Commands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {jobs.map((job) => (
                    <tr key={job._id} className="group hover:bg-white/[0.02] transition-colors relative">
                      <td className="px-8 py-7 max-w-md">
                        <div className="flex gap-6 items-start">
                           <div className="w-16 h-16 rounded-2xl bg-[#0a0a0b] border border-white/10 overflow-hidden flex-shrink-0 group-hover:border-blue-500/30 transition-all duration-300">
                             {job.featuredImage ? (
                               <img src={job.featuredImage} className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-gray-700">NA</div>
                             )}
                           </div>
                           <div>
                              <p className="text-lg font-black text-white group-hover:text-blue-400 transition-all truncate leading-tight">
                                {job.title}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs font-bold text-gray-500 uppercase tracking-tight">
                                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-blue-500" /> {job.state}</span>
                                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                <span className="flex items-center gap-1.5">{job.organization}</span>
                              </div>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-8">
                           <div className="text-center group-hover:scale-105 transition-all">
                              <p className="text-xl font-mono font-bold text-white leading-none">{job.viewCount.toLocaleString()}</p>
                              <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest mt-1">Impressions</p>
                           </div>
                           <div className="w-px h-8 bg-white/5" />
                           <div className="flex flex-col gap-1.5">
                              {job.isTrending && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                                  <TrendingUp className="w-3 h-3" /> Trending
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                <Calendar className="w-3 h-3" /> {new Date(job.createdAt).toLocaleDateString()}
                              </span>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-7 text-center">
                        <button 
                          onClick={() => toggleStatus(job)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border transition-all ${
                          job.status === 'published' 
                            ? 'bg-green-600/10 text-green-500 border-green-500/20 hover:bg-green-600/20' 
                            : 'bg-orange-600/10 text-orange-400 border-orange-500/20 hover:bg-orange-600/20'
                        }`}>
                          {job.status === 'published' ? (
                            <span className="flex items-center gap-1.5 justify-center"><CheckCircle className="w-3 h-3" /> Active</span>
                          ) : (
                            <span className="flex items-center gap-1.5 justify-center"><Clock className="w-3 h-3" /> Inactive</span>
                          )}
                        </button>
                      </td>
                      <td className="px-8 py-7 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                              onClick={() => window.open(`/jobs/${job.slug}`, '_blank')}
                              className="p-3 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/30 transition-all"
                              title="Public View"
                           >
                             <ExternalLink className="w-4 h-4" />
                           </button>
                           <button 
                              onClick={() => router.push(`/admin/jobs/${job._id}/edit`)}
                              className="p-3 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all"
                              title="Edit Registry"
                           >
                             <Edit2 className="w-4 h-4" />
                           </button>
                           <button 
                              onClick={() => deleteJob(job._id)}
                              className="p-3 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                              title="Purge Record"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination UI */}
              <div className="px-8 py-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                <p className="text-sm font-bold text-gray-600 tracking-tight uppercase">
                   Page Engine Cluster <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
                </p>
                <div className="flex gap-3">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="p-3 bg-white/5 border border-white/5 rounded-xl text-gray-400 disabled:opacity-30 hover:bg-white/10 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="p-3 bg-white/5 border border-white/5 rounded-xl text-gray-400 disabled:opacity-30 hover:bg-white/10 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
