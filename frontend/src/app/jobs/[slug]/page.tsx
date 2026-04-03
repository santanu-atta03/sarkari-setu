'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import api from '@/lib/api';
import DOMPurify from 'dompurify';
import { 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  MapPin, 
  Building2, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  ExternalLink, 
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Info,
  CreditCard,
  Target,
  Eye,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SingleJobPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('eligibility');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const resp = await api.get(`/jobs/${slug}`);
        setJob(resp.data.data);
      } catch (err) {
        console.error(err);
        // Maybe redirect to 404
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchJob();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-8">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-12 h-12 bg-blue-600/10 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs">Decoding Position Registry...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-white">
        Job not found.
      </div>
    );
  }

  const deadline = job.importantDates?.applicationEnd ? new Date(job.importantDates.applicationEnd) : null;
  const isUrgent = deadline && (deadline.getTime() - Date.now()) < (5 * 24 * 60 * 60 * 1000);

  const accordions = [
    { 
      id: 'eligibility', 
      label: 'Eligibility & Qualifications', 
      icon: GraduationCap, 
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
               <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Age Limit</p>
               <p className="text-xl font-black text-white">
                 {job.eligibility?.minAge || '18'} - {job.eligibility?.maxAge || 'As per norms'} Years
               </p>
            </div>
            <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
               <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Required Qualification</p>
               <p className="text-xl font-black text-white">{job.qualification}</p>
            </div>
          </div>
          {job.eligibility?.ageRelaxation && (
            <div className="flex items-start gap-4 p-6 bg-blue-600/5 border border-blue-600/10 rounded-3xl">
               <Info className="text-blue-500 flex-shrink-0" size={24} />
               <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                 <span className="text-blue-400 font-black uppercase text-[10px] tracking-widest block mb-1">Age Relaxation</span>
                 {job.eligibility.ageRelaxation}
               </p>
            </div>
          )}
        </div>
      )
    },
    { 
      id: 'fees', 
      label: 'Application Fee Structure', 
      icon: CreditCard, 
      content: (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'General / OBC', value: job.applicationFee?.general || job.applicationFee?.obc || 0 },
             { label: 'SC / ST', value: job.applicationFee?.scSt || 0 },
             { label: 'Female', value: job.applicationFee?.female || 0 },
             { label: 'Ex-Servicemen', value: job.applicationFee?.exServicemen || 0 },
           ].map((fee) => (
             <div key={fee.label} className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl text-center">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{fee.label}</p>
                <p className="text-2xl font-black text-white">₹{fee.value}</p>
             </div>
           ))}
        </div>
      )
    },
    { 
      id: 'vacancy', 
      label: 'Vacancy Breakdown', 
      icon: Target, 
      content: (
        <div className="space-y-6">
           <div className="p-8 bg-blue-600 font-black text-4xl text-white rounded-3xl flex items-center justify-between shadow-2xl shadow-blue-500/20">
              <span>Total Openings</span>
              <span>{job.vacancy?.total?.toLocaleString() || 'N/A'}</span>
           </div>
           {job.vacancy?.breakdown?.length > 0 && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {job.vacancy.breakdown.map((item: any, i: number) => (
                 <div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl">
                    <span className="text-zinc-400 font-bold">{item.post}</span>
                    <span className="text-white font-black">{item.count}</span>
                 </div>
               ))}
             </div>
           )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0b] flex flex-col font-sans transition-colors duration-500">
      <Navbar />

      <main className="flex-1">
        {/* Dynamic Hero Section */}
        <div className="relative h-[60vh] min-h-[500px] bg-zinc-900 overflow-hidden flex items-end pb-16">
           <div className="absolute inset-0 z-0">
             {job.featuredImage ? (
               <>
                 <img src={job.featuredImage} className="w-full h-full object-cover opacity-30 blur-sm scale-110" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent" />
               </>
             ) : (
               <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-indigo-900/40" />
             )}
           </div>

           <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                 <motion.div
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex-1"
                 >
                    <div className="flex items-center gap-4 mb-6">
                       <button 
                         onClick={() => router.back()}
                         className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-2xl"
                       >
                         <ArrowLeft size={24} />
                       </button>
                       <div className="px-4 py-2 bg-blue-600 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-blue-500/40">
                         {job.jobType}
                       </div>
                       {job.isTrending && (
                          <div className="px-4 py-2 bg-orange-500/20 border border-orange-500/40 rounded-full text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">
                            <TrendingUp size={12} className="inline mr-2" /> Trending Output
                          </div>
                       )}
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.05] drop-shadow-2xl">
                       {job.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-8">
                       <div className="flex items-center gap-2 text-zinc-300 font-bold tracking-tight">
                          <Building2 size={20} className="text-blue-500" /> {job.organization}
                       </div>
                       <div className="flex items-center gap-2 text-zinc-300 font-bold tracking-tight">
                          <MapPin size={20} className="text-blue-500" /> {job.state}, {job.district || 'India'}
                       </div>
                       <div className="flex items-center gap-2 text-zinc-300 font-bold tracking-tight">
                          <Eye className="text-blue-500" size={20} /> {job.viewCount?.toLocaleString()} Metrics
                       </div>
                    </div>
                 </motion.div>

                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.2 }}
                   className="lg:w-[400px] bg-white dark:bg-zinc-900/80 backdrop-blur-3xl p-8 rounded-[40px] border border-black/5 dark:border-white/5 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.4)] flex flex-col gap-6"
                 >
                    <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Application Phase</p>
                       <span className={`flex items-center gap-2 text-[10px] font-black uppercase ${isUrgent ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                          <div className={`w-2.5 h-2.5 rounded-full ${isUrgent ? 'bg-red-500' : 'bg-green-500'}`} />
                          {isUrgent ? 'Closing Soon' : 'Accepting Applications'}
                       </span>
                    </div>

                    <div className="flex items-center gap-4 group cursor-pointer">
                       <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                          <Calendar size={28} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Deadline Date</p>
                          <p className="text-xl font-black text-zinc-900 dark:text-white">{deadline ? deadline.toLocaleDateString() : 'TBD'}</p>
                       </div>
                    </div>

                    <div className="flex gap-4 mt-2">
                       <button 
                         onClick={() => window.open(job.applyOnlineUrl, '_blank')}
                         className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-blue-500/40 active:scale-95 transition-all text-xs"
                        >
                         Apply Now
                       </button>
                       <button className="w-20 py-5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl">
                         <Bookmark size={24} />
                       </button>
                    </div>
                 </motion.div>
              </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 py-24">
           {/* Detailed Information & Accordions */}
           <div className="lg:col-span-8 space-y-16">
              <section className="space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-blue-600 rounded-full" />
                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Position Review</h2>
                 </div>
                 <div 
                   className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium rich-text-content prose prose-invert max-w-none prose-headings:text-white prose-a:text-blue-500"
                   dangerouslySetInnerHTML={{ 
                     __html: typeof window !== 'undefined' 
                       ? DOMPurify.sanitize(job.fullContent || job.shortDescription) 
                       : (job.fullContent || job.shortDescription) 
                   }}
                 />
              </section>

              <section className="space-y-6">
                 {accordions.map((acc) => (
                    <div 
                      key={acc.id}
                      className={`rounded-[32px] border transition-all duration-500 ${
                        activeAccordion === acc.id 
                          ? 'border-blue-600/30 bg-blue-600/[0.02]' 
                          : 'border-black/5 dark:border-white/5 bg-transparent'
                      }`}
                    >
                       <button 
                         onClick={() => setActiveAccordion(activeAccordion === acc.id ? null : acc.id)}
                         className="w-full px-8 py-8 flex items-center justify-between text-left group"
                       >
                         <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                              activeAccordion === acc.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-500 group-hover:text-blue-500'
                            }`}>
                               <acc.icon size={24} />
                            </div>
                            <span className={`text-xl font-black uppercase tracking-tighter ${activeAccordion === acc.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                              {acc.label}
                            </span>
                         </div>
                         <div className={`p-2 rounded-full border border-white/5 transition-transform duration-500 ${activeAccordion === acc.id ? 'rotate-90 text-blue-500 border-blue-500/20' : 'text-zinc-600'}`}>
                            <ChevronRight size={20} />
                         </div>
                       </button>
                       <AnimatePresence>
                          {activeAccordion === acc.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                               <div className="px-8 pb-10 pt-2 border-t border-white/5">
                                 {acc.content}
                               </div>
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                 ))}
              </section>
           </div>

           {/* Sidebar Actions & Related Items */}
           <div className="lg:col-span-4 space-y-12">
              <div className="p-8 bg-zinc-900 dark:bg-zinc-900/40 rounded-[40px] border border-white/5 space-y-8">
                 <h3 className="text-xl font-bold text-white uppercase tracking-tighter border-b border-white/5 pb-6">Official Sources</h3>
                 <div className="space-y-4">
                    {[
                      { icon: FileText, label: 'Official Notification PDF', url: job.notificationPdfUrl },
                      { icon: Globe, label: 'Official Website', url: job.officialWebsite },
                      { icon: ExternalLink, label: 'Apply Direct External', url: job.applyOnlineUrl },
                    ].map((link, i) => (
                      <button 
                        key={i} 
                        onClick={() => window.open(link.url, '_blank')}
                        disabled={!link.url}
                        className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all disabled:opacity-30 group"
                      >
                         <div className="flex items-center gap-4">
                            <link.icon size={20} className="text-blue-500" />
                            <span className="text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-widest">{link.label}</span>
                         </div>
                         <ChevronRight size={16} className="text-gray-700" />
                      </button>
                    ))}
                 </div>
              </div>

              <div className="p-8 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                   <Target size={120} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-4">SarkariSetu Connect</p>
                 <h4 className="text-2xl font-black tracking-tighter leading-tight mb-8">
                   Stay informed about similar opportunities.
                 </h4>
                 <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all text-xs">
                    Get Email Alerts
                 </button>
              </div>
           </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        .rich-text-content * {
          max-width: 100%;
        }
        .rich-text-content ul {
          list-style-type: square;
          padding-left: 2rem;
          margin: 1.5rem 0;
        }
        .rich-text-content p {
          margin-bottom: 1.5rem;
        }
        .rich-text-content h2, .rich-text-content h3 {
          color: white;
          margin: 2rem 0 1rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.025em;
        }
      `}</style>
    </div>
  );
}
