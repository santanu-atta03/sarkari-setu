'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import JobForm from '@/components/admin/JobForm';
import { motion } from 'framer-motion';
import { Edit3, ArrowLeft, Loader2 } from 'lucide-react';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const resp = await api.get(`/jobs/${params.id}`);
        setJob(resp.data.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load job registry.');
        router.push('/admin/jobs');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchJob();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
        </div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing Identity Cluster...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6">
      <div className="flex items-center justify-between">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-6"
        >
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 bg-white/5 border border-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-all shadow-xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-3">
               <Edit3 className="text-indigo-400 w-5 h-5" />
               <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Registry Modification</p>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mt-1">Refine Job Parameters</h1>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <JobForm initialData={job} isEdit={true} />
      </motion.div>
    </div>
  );
}
