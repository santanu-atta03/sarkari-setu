'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink, 
  FileCheck, 
  Database,
  RefreshCcw,
  Plus
} from 'lucide-react';
import api from '@/lib/api';

export default function IngestionPage() {
  const [url, setUrl] = useState('https://ssc.gov.in/notices');
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const { data } = await api.get('/scraper/drafts');
      setDrafts(data.data);
    } catch (err) {
      console.error('Failed to fetch drafts', err);
    }
  };

  const handleCrawl = async () => {
    setLoading(true);
    setStatus({ type: null, message: '' });
    try {
      const { data } = await api.post('/scraper/discover', { url });
      setStatus({ type: 'success', message: data.message });
      fetchDrafts();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Crawl failed' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await api.patch(`/scraper/publish/${id}`);
      setDrafts(drafts.filter(d => d._id !== id));
      setStatus({ type: 'success', message: 'Job published successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to publish job' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <Database className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                Data Setu Ingestion
              </h1>
              <p className="text-gray-400 mt-1">AI-Powered Government Job Discovery & Extraction</p>
            </div>
          </motion.div>
        </header>

        {/* Discovery Tool */}
        <section className="mb-12">
          <div className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Search className="w-32 h-32" />
            </div>

            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-blue-400" />
              Automated Discovery
            </h2>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter official URL (e.g. ssc.gov.in/notices)"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-lg"
                />
              </div>
              <button 
                onClick={handleCrawl}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 active:scale-95"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                {loading ? 'Analyzing Source...' : 'Execute AI Crawl'}
              </button>
            </div>

            {status.type && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-2xl flex items-center gap-3 ${
                  status.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                }`}
              >
                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {status.message}
              </motion.div>
            )}
          </div>
        </section>

        {/* Pending Drafts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-amber-400" />
              Ingestion Queue
              <span className="text-sm bg-white/10 px-3 py-1 rounded-full font-mono font-normal">
                {drafts.length} Pending
              </span>
            </h2>
          </div>

          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {drafts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10"
                >
                  <Database className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No new notifications in queue. Start a crawl to find some!</p>
                </motion.div>
              ) : (
                drafts.map((job, index) => (
                  <motion.div
                    key={job._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-bold rounded uppercase tracking-wider">
                          {job.organization}
                        </span>
                        <span className="text-gray-500 text-xs">|</span>
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          Source Confirmed
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-1 italic max-w-2xl">
                        AI Excerpt: {job.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <a 
                        href={job.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-400"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                      <button 
                        onClick={() => handlePublish(job._id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95"
                      >
                        Approve & Publish
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <style jsx global>{`
        body {
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 40%);
        }
      `}</style>
    </div>
  );
}
