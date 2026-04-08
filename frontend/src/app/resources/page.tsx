'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Search, Filter, FileText } from 'lucide-react';

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [filterExam, setFilterExam] = useState('All');

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await fetch('http://localhost:5000/api/engagement/resources');
        const data = await res.json();
        if (Array.isArray(data)) setResources(data);
      } catch (err) {
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, []);

  const filteredResources = resources.filter(res => {
    if (filterType !== 'All' && res.type !== filterType) return false;
    if (filterExam !== 'All' && res.exam !== filterExam) return false;
    return true;
  });

  const uniqueExams = ['All', ...Array.from(new Set(resources.map(r => r.exam)))];

  return (
    <main className="min-h-screen pt-32 pb-20 bg-zinc-50 dark:bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full mb-6 font-bold text-sm">
            <BookOpen size={16} /> The Study Vault
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase mb-6">
            Syllabus & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Past Papers</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            Download previous year question papers (PYQs) and syllabus PDFs for popular exams. Stop searching, start preparing.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-2xl flex flex-col md:flex-row gap-4 mb-10 items-center">
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="w-full bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 rounded-xl py-3 pl-12 pr-4 font-medium outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 rounded-xl font-bold text-sm outline-none cursor-pointer flex-1 md:flex-none"
            >
              <option value="All">All Types</option>
              <option value="PYQ">PYQs</option>
              <option value="Syllabus">Syllabus</option>
            </select>

            <select 
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="px-4 py-3 bg-zinc-50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 rounded-xl font-bold text-sm outline-none cursor-pointer flex-1 md:flex-none"
            >
              {uniqueExams.map(exam => <option key={exam} value={exam}>{exam}</option>)}
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-40 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, i) => (
              <motion.div
                key={resource._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-3xl p-6 group hover:-translate-y-1 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl ${resource.type === 'PYQ' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'}`}>
                    <FileText size={24} strokeWidth={2.5} />
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-black uppercase text-zinc-400 mb-1">{resource.exam}</span>
                    <span className="inline-block px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold rounded text-zinc-500">
                      {resource.year ? resource.year : 'Latest'}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight mb-2">
                  {resource.title}
                </h3>
                
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500">
                    {resource.type === 'PYQ' ? 'Previous Year Paper' : 'Official Syllabus'}
                  </span>
                  
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-indigo-600/30">
                    <Download size={14} /> Get PDF
                  </button>
                </div>
              </motion.div>
            ))}
            
            {filteredResources.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-zinc-500 dark:text-zinc-400 text-lg font-medium">No resources found matching your filters.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
