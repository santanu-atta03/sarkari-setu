'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { MessageSquare, AlertTriangle, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommunitySection({ jobId }: { jobId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('Exam Extended');
  const [reportDesc, setReportDesc] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [jobId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/community/jobs/${jobId}/comments`);
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const res = await api.post(`/community/jobs/${jobId}/comments`, { content: newComment });
      if (res.data.success) {
        toast.success('Comment posted successfully!');
        setNewComment('');
        fetchComments();
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error('Please login to post a comment');
      } else {
        toast.error(err.response?.data?.message || 'Failed to post comment');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDesc.trim()) return;

    setIsReporting(true);
    try {
      const res = await api.post('/community/reports', {
        jobId,
        reportType,
        description: reportDesc
      });
      if (res.data.success) {
        toast.success('Report submitted successfully. Thank you!');
        setIsReportModalOpen(false);
        setReportDesc('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="mt-16 space-y-12">
      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-6">
        <h3 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter flex items-center gap-4">
          <MessageSquare className="text-blue-500" size={32} /> Discussions
        </h3>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
        >
          <AlertTriangle size={16} /> Report Error / Update
        </button>
      </div>

      <div className="space-y-8">
        <form onSubmit={handlePostComment} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ask a doubt or share an update..."
            className="flex-1 bg-zinc-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 px-6 py-4 rounded-2xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/30"
          >
            {isLoading ? <span className="animate-spin text-xl">◌</span> : <><Send size={18} /> Post</>}
          </button>
        </form>

        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-zinc-500 text-center py-10 font-medium">No comments yet. Be the first to start the discussion!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="p-6 bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-3xl flex gap-4">
                <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-zinc-900 dark:text-white">{comment.user?.name || 'Anonymous User'}</span>
                    <span className="text-xs text-zinc-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {isReportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0a0a0b] border border-black/5 dark:border-white/5 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-2">Report Error / Update</h3>
                <p className="text-zinc-500 text-sm mb-6">Found an error or missing job detail? Let us know!</p>
                
                <form onSubmit={handleReportSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Issue Type</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 px-4 py-3 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="Exam Extended">Exam Extended</option>
                      <option value="Missing Job">Missing Job</option>
                      <option value="Typo/Error">Typo/Error</option>
                      <option value="Syllabus Doubt">Syllabus Doubt</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea
                      value={reportDesc}
                      onChange={(e) => setReportDesc(e.target.value)}
                      rows={4}
                      placeholder="Please provide details..."
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 px-4 py-3 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsReportModalOpen(false)}
                      className="px-6 py-3 text-zinc-500 font-bold uppercase tracking-widest text-xs hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isReporting || !reportDesc.trim()}
                      className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-xl shadow-red-500/30 flex items-center justify-center"
                    >
                      {isReporting ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
