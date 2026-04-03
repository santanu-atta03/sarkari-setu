'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
  PlusCircle
} from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Job Posts', value: '124', icon: FileText, change: '+12%', trend: 'up' },
    { label: 'Total Page Views', value: '45.2K', icon: Eye, change: '+5.4%', trend: 'up' },
    { label: 'Active Admins', value: '4', icon: Users, change: 'Stable', trend: 'neutral' },
    { label: 'Pending Drafts', value: '8', icon: Clock, change: '-2', trend: 'down' },
  ];

  const recentJobs = [
    { title: 'SSC Multi-Tasking Staff (MTS)', org: 'Staff Selection Commission', status: 'Published', views: 1240, date: '2 hours ago' },
    { title: 'RBI Grade B Officer Recruit', org: 'Reserve Bank of India', status: 'Published', views: 3500, date: '5 hours ago' },
    { title: 'Railway Recruitment Board ALP', org: 'Indian Railways', status: 'Draft', views: 0, date: 'Yesterday' },
    { title: 'UPSC Civil Services Prelims', org: 'UPSC', status: 'Published', views: 8200, date: '2 days ago' },
  ];

  return (
    <div className="space-y-10 py-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-gray-400 mt-2 text-lg">Detailed analytics for SarkariSetu operations</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-all">
            Generate Report
          </button>
          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Live Insights
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
            <p className="text-3xl font-bold text-white">{stat.value}</p>
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
            <button className="text-sm text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1 group">
              View All <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-gray-500 border-b border-white/5">
                  <th className="px-8 py-4 font-semibold">Job Details</th>
                  <th className="px-8 py-4 font-semibold text-center">Status</th>
                  <th className="px-8 py-4 font-semibold text-right">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentJobs.map((job, idx) => (
                  <tr key={idx} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <td className="px-8 py-5">
                      <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{job.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{job.org} &bull; {job.date}</p>
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
            <button className="w-full bg-white text-blue-700 font-bold py-3.5 rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Add New Job
            </button>
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
                { name: 'View Live Site', icon: ExternalLink },
                { name: 'Backup Database', icon: FileText },
                { name: 'System Logs', icon: Clock },
              ].map((link) => (
                <button 
                  key={link.name}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
                >
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-white">{link.name}</span>
                  <link.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-400" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
