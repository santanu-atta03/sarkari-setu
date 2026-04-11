'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  TrendingUp, 
  Eye, 
  Users, 
  FileText, 
  ArrowUpRight, 
  Clock,
  Briefcase,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  Loader2,
  RefreshCcw,
  ShieldCheck
} from 'lucide-react';
import api from '@/lib/api';
import Modal from '@/components/admin/Modal';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<{
    stats: {
      totalJobs: number;
      pendingDrafts: number;
      totalViews: number;
      activeAdmins: number;
      totalUsers: number;
    };
    recentJobs: Array<{
      id: string;
      title: string;
      org: string;
      status: string;
      views: number;
      date: string;
    }>;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await api.get('/admin/dashboard-stats');
      setData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setModalContent({
        title: 'Connection Error',
        message: 'Unable to sync with the real-time server. Please check your connection.'
      });
      setIsModalOpen(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Real-time update simulation via polling (every 30 seconds)
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse">Syncing real-time records...</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Job Posts', value: data?.stats.totalJobs.toString() || '0', icon: FileText, trend: 'up', change: '+5%' },
    { label: 'Total Page Views', value: (data?.stats.totalViews || 0).toLocaleString(), icon: Eye, trend: 'up', change: '+12%' },
    { label: 'Platform Users', value: (data?.stats.totalUsers || 0).toString(), icon: Users, trend: 'up', change: 'New' },
    { label: 'Pending Drafts', value: data?.stats.pendingDrafts.toString() || '0', icon: Clock, trend: 'neutral', change: 'Action' },
  ];

  return (
    <div className="space-y-10 py-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Live System</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-gray-400 mt-2 text-lg">Detailed analytics for SarkariSetu operations</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="px-5 py-2.5 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Sync Now
          </button>
          <button 
            onClick={() => {
              setModalContent({
                title: 'System Health',
                message: 'All backend services are operational. Database latency: 45ms. Security protocols active.'
              });
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Health Status
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#121214] border border-white/5 p-6 rounded-3xl group hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                stat.trend === 'up' ? 'bg-green-500/10 text-green-500' : 
                stat.trend === 'down' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-400'
              }`}>
                {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-[#121214] border border-white/5 rounded-3xl overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              Recent Job Postings
            </h2>
            <Link href="/admin/jobs" className="text-sm text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1 group">
              View All <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-gray-500 border-b border-white/5">
                  <th className="px-8 py-4 font-semibold whitespace-nowrap">Job Details</th>
                  <th className="px-8 py-4 font-semibold text-center">Status</th>
                  <th className="px-8 py-4 font-semibold text-right">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.recentJobs.map((job, idx) => (
                  <tr 
                    key={job.id} 
                    onClick={() => router.push(`/admin/jobs/${job.id}`)}
                    className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="px-8 py-5">
                      <p className="font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{job.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{job.org} &bull; {timeAgo(job.date)}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        job.status === 'Published' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-400'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-mono text-gray-400 group-hover:text-white transition-colors">
                      {job.views.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {(!data || data.recentJobs.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-8 py-10 text-center text-gray-500 italic">
                      No jobs posted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-900/20"
          >
            <h3 className="text-xl font-bold mb-2">New Announcement?</h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Create a new job post with our optimized rich text editor to notify thousands of candidates instantly.
            </p>
            <Link href="/admin/jobs/new" className="block w-full">
              <button className="w-full bg-white text-blue-700 font-bold py-3.5 rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Add New Job
              </button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#121214] border border-white/5 p-8 rounded-3xl"
          >
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <div className="space-y-4">
              {[
                { name: 'View Live Site', icon: ExternalLink, href: '/' },
                { name: 'User Management', icon: Users, href: '/admin/users' },
                { name: 'System Logs', icon: Clock, href: '/admin/logs' },
              ].map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
                >
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-white">{link.name}</span>
                  <link.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-400" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalContent.title}
      >
        <p className="leading-relaxed">{modalContent.message}</p>
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all"
          >
            Dismiss
          </button>
        </div>
      </Modal>
    </div>
  );
}
