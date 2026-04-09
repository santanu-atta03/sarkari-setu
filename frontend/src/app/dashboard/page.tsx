'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  GraduationCap, 
  Users, 
  Clock,
  AlertCircle,
  Loader2,
  Bookmark
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Job {
  _id: string;
  title: string;
  slug: string;
  organization: string;
  state: string;
  jobType: string;
  qualification: string;
  vacancy: { total: number };
  importantDates: { applicationEnd: string };
}

export default function DashboardHome() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEligibleJobs = async () => {
      try {
        const res = await api.get('/users/eligible-jobs');
        if (res.data.success) {
          setJobs(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load recommended jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchEligibleJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Matching your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg">
                <Sparkles size={16} />
             </div>
             <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Personalized AI Feed</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">Recommended For You</h1>
          <p className="text-zinc-500 mt-2 font-medium">We've found {jobs.length} jobs matching your qualifications.</p>
        </div>
        <Link 
          href="/dashboard/profile" 
          className="px-6 py-3 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black/5 transition-all shadow-sm"
        >
          Update My Profile
        </Link>
      </div>

      {error ? (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-[32px] p-10">
          <div className="flex items-start gap-6">
             <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-600">
                <AlertCircle size={28} />
             </div>
             <div className="flex-1">
                <h3 className="text-xl font-black text-amber-900 dark:text-amber-100 tracking-tight mb-2">Profile Incomplete</h3>
                <p className="text-amber-800/70 dark:text-amber-200/60 font-medium mb-8 leading-relaxed">{error}</p>
                <Link
                  href="/dashboard/profile"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-amber-500/20"
                >
                  Complete Profile Now <ArrowRight size={16} />
                </Link>
             </div>
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-zinc-50 dark:bg-white/5 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-[40px] p-16 text-center">
          <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 mx-auto mb-6 transform rotate-12">
             <Bookmark size={40} />
          </div>
          <p className="text-xl font-bold text-zinc-800 dark:text-white mb-2">No matching jobs found today.</p>
          <p className="text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed">Try adjusting your profile or check back later. New opportunities are added daily!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {jobs.map((job, idx) => (
            <motion.div 
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-blue-600/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter line-clamp-2 hover:text-blue-600 transition-colors">
                      <Link href={`/jobs/${job.slug}`}>
                        {job.title}
                      </Link>
                    </h3>
                    <p className="text-sm font-bold text-blue-600 mt-1 uppercase tracking-widest">{job.organization}</p>
                 </div>
                 <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0">
                    {job.jobType}
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                      <GraduationCap size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Qualification</p>
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{job.qualification}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                      <Users size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Vacancies</p>
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{job.vacancy?.total || 'N/A'}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                      <MapPin size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">State</p>
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{job.state}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center justify-center text-red-400">
                      <Clock size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Deadline</p>
                      <p className="text-xs font-bold text-red-600">{job.importantDates?.applicationEnd 
                        ? new Date(job.importantDates.applicationEnd).toLocaleDateString() 
                        : 'N/A'}</p>
                   </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  href={`/jobs/${job.slug}`}
                  className="flex-1 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-[10px] text-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                  Deep View
                </Link>
                <button className="w-14 h-14 border border-black/5 dark:border-white/10 rounded-2xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                   <Bookmark size={20} className="text-zinc-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
