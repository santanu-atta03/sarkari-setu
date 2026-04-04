import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0a0b] transition-colors duration-500">
      <div className="relative group">
        {/* Glowing background */}
        <div className="absolute inset-0 bg-blue-600/20 blur-[60px] rounded-full scale-150 animate-pulse" />
        
        {/* Main loader */}
        <div className="relative flex flex-col items-center gap-6 px-12 py-12 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[48px] shadow-2xl">
          <div className="relative">
             <div className="w-16 h-16 border-4 border-blue-600/20 rounded-full" />
             <Loader2 className="w-16 h-16 text-blue-600 animate-spin absolute inset-0" strokeWidth={3} />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter mb-1">
              Sarkari<span className="text-blue-600">Setu</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Negotiating with Server...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
