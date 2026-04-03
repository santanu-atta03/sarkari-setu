'use client';

import React from 'react';
import JobForm from '@/components/admin/JobForm';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateJobPage() {
  const router = useRouter();

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
               <Sparkles className="text-blue-500 w-5 h-5" />
               <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">New Recruitment Engine</p>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight mt-1">Generate Job Listing</h1>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <JobForm />
      </motion.div>
    </div>
  );
}
