'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  Zap,
  Clock,
  ExternalLink,
  Users
} from 'lucide-react';

import Image from 'next/image';
import api from '@/lib/api';

interface JobCardProps {
  job: any;
  featured?: boolean;
}

export default function JobCard({ job, featured = false }: JobCardProps) {
  const deadline = job.importantDates?.applicationEnd ? new Date(job.importantDates.applicationEnd) : null;
  const isUrgent = deadline && (deadline.getTime() - Date.now()) < (5 * 24 * 60 * 60 * 1000); // 5 days

  return (
    <motion.div
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative group h-full bg-[#16161a] border border-white/5 dark:bg-zinc-900/40 rounded-[32px] overflow-hidden shadow-2xl hover:shadow-blue-600/10 hover:border-blue-500/30 transition-all duration-500 flex flex-col ${
        featured ? 'ring-2 ring-blue-500/20' : ''
      }`}
    >
      <div className="absolute top-0 right-0 p-6 z-10 flex gap-2">
        {job.trendingScore > 0 && (
          <div className="bg-orange-500/10 backdrop-blur-md border border-orange-500/20 px-3 py-1.5 rounded-full text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
            <TrendingUp size={12} className="animate-pulse" /> Popular
          </div>
        )}
        {featured && (
          <div className="bg-blue-600/10 backdrop-blur-md border border-blue-600/20 px-3 py-1.5 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
            <Zap size={12} fill="currentColor" /> Featured
          </div>
        )}
      </div>

      <div className="relative h-48 overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
        <div className="absolute inset-0 bg-gradient-to-t from-[#16161a] to-transparent z-[2]" />
        {job.featuredImage ? (
           <Image
            src={job.featuredImage} 
            fill
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            alt={job.title}
           />
        ) : (
           <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-indigo-900/40 flex items-center justify-center">
             <Building2 size={48} className="text-white/10" />
           </div>
        )}
      </div>

      <div className="p-8 flex-1 flex flex-col relative z-[5]">
        <div className="mb-4">
           <div className="flex items-center gap-2 mb-3">
             <div className="px-2.5 py-1 bg-blue-600/10 border border-blue-600/20 rounded-lg text-[10px] font-black text-blue-500 uppercase tracking-widest">
                {job.jobType?.split(' ')[0]}
             </div>
             <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
                ID: {job.slug?.split('-').pop()}
             </div>
           </div>
           
           <Link href={`/jobs/${job.slug}`} className="block group/title">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white leading-tight line-clamp-2 transition-colors duration-300 group-hover/title:text-blue-500 group-hover:underline decoration-blue-500/50 decoration-2 underline-offset-4">
                {job.title}
              </h3>
           </Link>
        </div>

        <div className="space-y-3 mt-auto">
           <div className="flex items-center gap-3 text-sm text-zinc-500 font-bold tracking-tight">
             <Building2 size={16} className="text-blue-500" /> {job.organization}
           </div>
           <div className="flex items-center gap-3 text-sm text-zinc-500 font-bold tracking-tight">
             <MapPin size={16} className="text-blue-500" /> {job.state}
           </div>
           {job.vacancy?.total > 0 && (
              <div className="flex items-center gap-3 text-sm text-zinc-500 font-bold tracking-tight">
                <Users size={16} className="text-blue-500" /> {job.vacancy.total.toLocaleString()} Vacancies
              </div>
           )}
        </div>

        <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-4">
           <div className="flex flex-col flex-1">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">
                {job.admitCardUrl ? 'Exam Date' : job.resultUrl ? 'Result Status' : 'Application Last Date'}
              </p>
              <div className={`flex items-center gap-1.5 text-sm font-black ${isUrgent && !job.resultUrl ? 'text-red-500 animate-pulse' : 'text-zinc-600 dark:text-white'}`}>
                <Clock size={14} /> 
                {job.admitCardUrl 
                  ? (job.importantDates?.examDate ? new Date(job.importantDates.examDate).toLocaleDateString() : 'Announced')
                  : job.resultUrl 
                    ? 'Released' 
                    : (deadline ? deadline.toLocaleDateString() : 'TBD')}
              </div>
           </div>

           {job.viewCount > 0 && (
             <div className="flex flex-col items-end shrink-0">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Activity</p>
                <div className="flex items-center gap-1 text-sm font-black text-blue-500 tracking-tighter">
                   <Users size={14} /> {job.viewCount.toLocaleString()}
                </div>
             </div>
           )}
           
           <div className="flex gap-2">
             {job.admitCardUrl && (
               <button 
                 onClick={async (e) => {
                   e.preventDefault();
                   window.open(job.admitCardUrl, '_blank');
                   try { await api.patch(`/jobs/${job._id}/download?type=admitCard`); } catch(err) { console.error(err); }
                 }}
                 className="px-4 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20 text-xs font-black uppercase tracking-widest gap-2"
                 title="Download Admit Card"
               >
                 <ArrowRight size={16} /> Admit
               </button>
             )}

             {job.resultUrl && (
               <button 
                 onClick={async (e) => {
                   e.preventDefault();
                   window.open(job.resultUrl, '_blank');
                   try { await api.patch(`/jobs/${job._id}/download?type=result`); } catch(err) { console.error(err); }
                 }}
                 className="px-4 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-600/20 text-xs font-black uppercase tracking-widest gap-2"
                 title="Check Result"
               >
                 <ArrowRight size={16} /> Result
               </button>
             )}

             {!job.admitCardUrl && !job.resultUrl && (
               <Link 
                 href={`/jobs/${job.slug}`} 
                 className="w-12 h-12 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl group-hover:shadow-blue-600/20"
               >
                 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </Link>
             )}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
