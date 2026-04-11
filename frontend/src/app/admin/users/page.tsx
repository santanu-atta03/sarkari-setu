'use client';

import React from 'react';
import { Users, ShieldAlert } from 'lucide-react';

export default function UsersPlaceholder() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#121214] border border-white/5 rounded-[40px] shadow-2xl">
      <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 mb-8 border border-blue-500/20">
        <Users className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold text-white tracking-tight mb-4 uppercase">User Directory</h1>
      <p className="max-w-md text-gray-500 leading-relaxed mb-10">
        The centralized user management module is currently under encryption review. 
        Access to candidate profiles and engagement metrics will be available in the next deployment.
      </p>
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest">
        <ShieldAlert className="w-4 h-4" /> Strictly Restricted Access
      </div>
    </div>
  );
}
