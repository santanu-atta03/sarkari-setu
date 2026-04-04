'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import api from '@/lib/api';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  User, 
  GraduationCap, 
  MapPin, 
  ArrowRight,
  Loader2,
  Calendar,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const QUALIFICATIONS = [
  '8th Pass',
  '10th Pass',
  '12th Pass',
  'Diploma',
  'Graduate',
  'Post Graduate',
  'PhD',
  'Any',
];

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 
  'Andaman and Nicobar Islands', 'Chandigarh', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export default function EligibilityCheckerPage() {
  const [formData, setFormData] = useState({
    age: '',
    qualification: '',
    state: ''
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 18 || Number(formData.age) > 60) {
      setError('Please enter a valid age between 18 and 60.');
      return false;
    }
    if (!formData.qualification) {
      setError('Please select your qualification.');
      return false;
    }
    if (!formData.state) {
      setError('Please select your state.');
      return false;
    }
    return true;
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    try {
      const response = await api.get('/jobs', {
        params: {
          age: formData.age,
          qualification: formData.qualification,
          state: formData.state,
          status: 'published',
          limit: 50
        }
      });
      setResults(response.data.data);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch eligibility results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0b] transition-colors duration-500">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header Section */}
          <div className="max-w-3xl mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6"
            >
              <CheckCircle2 size={12} /> Smart Eligibility Engine
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none mb-6"
            >
              Check Your <span className="text-blue-600">Eligibility</span> In Seconds.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-zinc-500 font-medium leading-relaxed"
            >
              Enter your details below to instantly find government jobs you're eligible for. No more reading long notification PDFs to find your criteria.
            </motion.p>
          </div>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 rounded-[40px] p-8 md:p-12 mb-16 shadow-2xl shadow-blue-600/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none" />
            
            <form onSubmit={handleCheck} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end relative z-10">
              {/* Age Input */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">
                  <User size={14} className="text-blue-600" /> Your Age
                </label>
                <div className="relative group">
                  <input 
                    type="number" 
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="E.g. 25"
                    className="w-full bg-white dark:bg-zinc-900 border-2 border-black/5 dark:border-white/5 focus:border-blue-600 dark:focus:border-blue-600 rounded-2xl px-6 py-4 text-lg font-bold text-zinc-900 dark:text-white outline-none transition-all group-hover:bg-white dark:group-hover:bg-zinc-800"
                  />
                </div>
              </div>

              {/* Qualification Select */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">
                  <GraduationCap size={14} className="text-blue-600" /> Qualification
                </label>
                <select 
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-zinc-900 border-2 border-black/5 dark:border-white/5 focus:border-blue-600 dark:focus:border-blue-600 rounded-2xl px-6 py-4 text-lg font-bold text-zinc-900 dark:text-white outline-none transition-all cursor-pointer"
                >
                  <option value="">Select Qualification</option>
                  {QUALIFICATIONS.map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              {/* State Select */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">
                  <MapPin size={14} className="text-blue-600" /> Preferred State
                </label>
                <select 
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-zinc-900 border-2 border-black/5 dark:border-white/5 focus:border-blue-600 dark:focus:border-blue-600 rounded-2xl px-6 py-4 text-lg font-bold text-zinc-900 dark:text-white outline-none transition-all cursor-pointer"
                >
                  <option value="">Select State</option>
                  {STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="md:col-span-3 flex items-center gap-2 text-red-500 text-sm font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20"
                  >
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="md:col-span-3 mt-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
                >
                  {loading ? (
                    <>Processing <Loader2 size={18} className="animate-spin" /></>
                  ) : (
                    <>Check Eligibility <ArrowRight size={18} /></>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Results Section */}
          <div className="space-y-12">
            {!hasSearched && !loading && (
              <div className="text-center py-20 border-2 border-dashed border-black/5 dark:border-white/5 rounded-[40px]">
                <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                  <Search size={32} />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">Ready to check?</h3>
                <p className="text-zinc-500 font-medium mt-2">Enter your details above to see the magic happen.</p>
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-zinc-50 dark:bg-zinc-900 animate-pulse rounded-2xl" />
                ))}
              </div>
            )}

            {hasSearched && !loading && results.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">
                    Found <span className="text-blue-600">{results.length} Eligible Jobs</span>
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                      <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                        <th className="px-8 pb-4">Organization & Post</th>
                        <th className="px-8 pb-4">Qualification</th>
                        <th className="px-8 pb-4">Deadline</th>
                        <th className="px-8 pb-4">Vacancy</th>
                        <th className="px-8 pb-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((job) => (
                        <motion.tr 
                          key={job._id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="group bg-zinc-50 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl transition-all"
                        >
                          <td className="px-8 py-6 rounded-l-[32px]">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                                {job.organization[0]}
                              </div>
                              <div>
                                <Link href={`/jobs/${job.slug}`} className="text-lg font-black text-zinc-900 dark:text-white hover:text-blue-600 transition-colors block">
                                  {job.title}
                                </Link>
                                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase mt-1">
                                  <Briefcase size={12} /> {job.organization}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-4 py-2 bg-zinc-200/50 dark:bg-zinc-800 rounded-full text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase">
                              {job.qualification}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                              <Calendar size={14} className="text-blue-600" />
                              {job.importantDates?.applicationEnd ? new Date(job.importantDates.applicationEnd).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-lg font-black text-zinc-900 dark:text-white">
                              {job.vacancy?.total || 'N/A'}
                            </div>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Posts</span>
                          </td>
                          <td className="px-8 py-6 text-right rounded-r-[32px]">
                            <Link 
                              href={`/jobs/${job.slug}`}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl"
                            >
                              Details <ArrowRight size={14} />
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {hasSearched && !loading && results.length === 0 && (
              <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/40 rounded-[40px] border border-black/5 dark:border-white/5">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                  <XCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">No eligible jobs found</h3>
                <p className="text-zinc-500 font-medium mt-2 max-w-md mx-auto">
                  We couldn't find any active jobs matching your criteria. Try adjusting your search or check back later!
                </p>
                <button 
                  onClick={() => {
                    setHasSearched(false);
                    setFormData({ age: '', qualification: '', state: '' });
                  }}
                  className="mt-8 text-blue-600 font-black uppercase tracking-widest text-xs hover:underline"
                >
                  Reset Search Criteria
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
