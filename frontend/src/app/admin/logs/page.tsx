'use client';

import React from 'react';
import { Terminal, Cpu } from 'lucide-react';

export default function LogsPlaceholder() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#0a0a0b] border border-white/5 rounded-[40px] shadow-2xl overflow-hidden relative group">
      <div className="absolute inset-0 bg-blue-600/[0.02] pointer-events-none" />
      <div className="w-24 h-24 bg-indigo-600/10 rounded-3xl flex items-center justify-center text-indigo-500 mb-8 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
        <Terminal className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-4 uppercase font-mono">Kernel.logs</h1>
      <pre className="max-w-xl text-left text-xs text-gray-600 leading-relaxed mb-10 bg-black/40 p-6 rounded-2xl border border-white/5 font-mono overflow-hidden">
        {`[SUCCESS] Sys-Core initialized...
[INFO] Monitoring real-time job ingestion...
[WARN] Unauthorized access attempt blocked at node::774
[DEBUG] Syncing database with cloud-origin-01
[INFO] Admin dashboard session starting...
> System logs are being piped to the secure archive.`}
      </pre>
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-xs font-bold uppercase tracking-widest">
        <Cpu className="w-4 h-4" /> Live Stream Encrypted
      </div>
    </div>
  );
}
