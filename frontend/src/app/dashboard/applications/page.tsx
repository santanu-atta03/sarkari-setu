'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { 
  History, 
  ExternalLink, 
  Download, 
  CheckCircle2, 
  Clock, 
  Calendar,
  AlertCircle,
  FileText,
  ClipboardList,
  Loader2,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JobReference {
  _id: string;
  title: string;
  slug: string;
  organization: string;
  importantDates: {
    applicationEnd?: string;
    admitCardDate?: string;
    examDate?: string;
    resultDate?: string;
  };
  admitCardUrl?: string;
  resultUrl?: string;
}

interface Application {
  _id: string;
  jobId: JobReference;
  appliedAt: string;
  applicationNumber: string;
  customStatus: string;
}

export default function MyApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/users/applications');
        if (res.data.success) {
          setApps(res.data.data);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Retrieving your timeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                <History size={16} />
             </div>
             <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Real-time Progress Tracker</span>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">My Exam Journey</h1>
          <p className="text-zinc-500 mt-2 font-medium">Tracking {apps.length} active applications & examinations.</p>
        </div>
        <Link 
          href="/jobs" 
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
        >
          Track New Job
        </Link>
      </div>
      
      {apps.length === 0 ? (
        <div className="bg-zinc-50 dark:bg-white/5 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-[40px] p-16 text-center">
          <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 mx-auto mb-6 transform -rotate-12">
             <ClipboardList size={40} />
          </div>
          <p className="text-xl font-bold text-zinc-800 dark:text-white mb-2">Your tracker is empty.</p>
          <p className="text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed">Start tracking your government job journey by adding applications from the listings.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {apps.map((app, idx) => {
            const job = app.jobId;
            if (!job) return null;

            return (
              <motion.div 
                key={app._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 rounded-[40px] p-8 lg:p-10 hover:shadow-2xl hover:shadow-indigo-600/5 transition-all group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/[0.02] dark:bg-indigo-600/5 blur-3xl -mr-32 -mt-32 pointer-events-none" />
                
                <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 relative z-10">
                  <div>
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter mb-2 group-hover:text-indigo-600 transition-colors">
                      <Link href={`/jobs/${job.slug}`}>
                        {job.title}
                      </Link>
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                       <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{job.organization}</p>
                       <div className="h-1 w-1 rounded-full bg-zinc-300" />
                       <div className="flex items-center gap-2 text-zinc-500">
                          <FileText size={14} className="text-zinc-400" />
                          <span className="text-xs font-bold uppercase tracking-widest">Ref: {app.applicationNumber || 'N/A'}</span>
                       </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Current Status</p>
                      <p className="text-sm font-black text-indigo-900 dark:text-indigo-100 uppercase tracking-tight">{app.customStatus || 'In Progress'}</p>
                  </div>
                </div>

                {/* Advanced Timeline UI */}
                <div className="relative z-10 px-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-8">
                     
                     {/* Applied Stage */}
                     <div className="flex items-center md:flex-col gap-4 md:gap-3 flex-1">
                        <div className="relative">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 z-10 relative">
                              <CheckCircle2 size={24} />
                           </div>
                           <div className="hidden md:block absolute top-1/2 left-full w-full h-[2px] bg-indigo-600 -translate-y-1/2 -z-10" />
                        </div>
                        <div className="md:text-center">
                           <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Applied</p>
                           <p className="text-[10px] font-bold text-zinc-400 mt-1">{new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                     </div>

                     {/* Admit Card Stage */}
                     <div className="flex items-center md:flex-col gap-4 md:gap-3 flex-1">
                        <div className="relative">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 z-10 relative shadow-xl ${job.admitCardUrl ? 'bg-indigo-600 text-white shadow-indigo-600/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 opacity-50'}`}>
                              <History size={24} />
                           </div>
                           <div className="hidden md:block absolute top-1/2 left-full w-full h-[2px] bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 -z-10">
                              {job.admitCardUrl && <div className="h-full bg-indigo-600 w-full animate-grow-x" />}
                           </div>
                        </div>
                        <div className="md:text-center">
                           <p className={`text-xs font-black uppercase tracking-widest ${job.admitCardUrl ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>Admit Card</p>
                           {job.importantDates?.admitCardDate && (
                             <p className="text-[10px] font-bold text-zinc-400 mt-1">{new Date(job.importantDates.admitCardDate).toLocaleDateString()}</p>
                           )}
                           {job.admitCardUrl && (
                             <a href={job.admitCardUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-500 mt-2 uppercase tracking-widest transition-colors">
                                <Download size={12} strokeWidth={3} /> Get Card
                             </a>
                           )}
                        </div>
                     </div>

                     {/* Exam Stage */}
                     <div className="flex items-center md:flex-col gap-4 md:gap-3 flex-1">
                        <div className="relative">
                           {/* Logic: if exam date is passed, it's green/done */}
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 z-10 relative shadow-xl ${(job.importantDates?.examDate && new Date(job.importantDates.examDate) < new Date()) ? 'bg-indigo-600 text-white shadow-indigo-600/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 opacity-50'}`}>
                              <Calendar size={24} />
                           </div>
                           <div className="hidden md:block absolute top-1/2 left-full w-full h-[2px] bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 -z-10">
                              {(job.importantDates?.examDate && new Date(job.importantDates.examDate) < new Date()) && <div className="h-full bg-indigo-600 w-full animate-grow-x" />}
                           </div>
                        </div>
                        <div className="md:text-center">
                           <p className={`text-xs font-black uppercase tracking-widest ${(job.importantDates?.examDate && new Date(job.importantDates.examDate) < new Date()) ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>Examination</p>
                           {job.importantDates?.examDate && (
                             <p className="text-[10px] font-bold text-zinc-400 mt-1">{new Date(job.importantDates.examDate).toLocaleDateString()}</p>
                           )}
                        </div>
                     </div>

                     {/* Result Stage */}
                     <div className="flex items-center md:flex-col gap-4 md:gap-3 shrink-0">
                        <div className="relative">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 z-10 relative shadow-xl ${job.resultUrl ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 opacity-50'}`}>
                              <Trophy size={24} />
                           </div>
                        </div>
                        <div className="md:text-center">
                           <p className={`text-xs font-black uppercase tracking-widest ${job.resultUrl ? 'text-emerald-600' : 'text-zinc-400'}`}>Final Result</p>
                           {job.importantDates?.resultDate && (
                             <p className="text-[10px] font-bold text-zinc-400 mt-1">{new Date(job.importantDates.resultDate).toLocaleDateString()}</p>
                           )}
                           {job.resultUrl && (
                             <a href={job.resultUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 hover:text-emerald-500 mt-2 uppercase tracking-widest transition-colors">
                                <ExternalLink size={12} strokeWidth={3} /> Check Rank
                             </a>
                           )}
                        </div>
                     </div>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
