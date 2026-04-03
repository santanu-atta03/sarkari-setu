'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, User, Bell, Database, Globe } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    { title: 'Account Security', icon: Shield, desc: 'Manage your password and session security.' },
    { title: 'Profile Settings', icon: User, desc: 'Update your display name and contact email.' },
    { title: 'Notifications', icon: Bell, desc: 'Configure system alert thresholds and emails.' },
    { title: 'Database & Backups', icon: Database, desc: 'Execute manual backups or view sync logs.' },
    { title: 'Site Configuration', icon: Globe, desc: 'Update metadata for the public facing site.' },
  ];

  return (
    <div className="space-y-10 py-6">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight">System Configuration</h1>
        <p className="text-gray-400 mt-2 text-lg">Manage administrative preferences and security layers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-[#121214] border border-white/5 p-8 rounded-3xl group hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <Settings className="w-5 h-5 text-blue-500/50 animate-spin-slow" />
            </div>
            
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all">
                <section.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{section.title}</h3>
                <p className="text-gray-500 mt-1 text-sm leading-relaxed">{section.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400">
             <Shield className="w-6 h-6" />
           </div>
           <div>
             <h4 className="font-bold text-white text-lg">System Integrity: Optimal</h4>
             <p className="text-sm text-gray-500">All security modules are operating within normal parameters.</p>
           </div>
        </div>
        <button className="px-6 py-2.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
          Run Diagnostics
        </button>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
