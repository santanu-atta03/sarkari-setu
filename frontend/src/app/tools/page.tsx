'use client';
import { useState } from 'react';
import { Calculator, Target, ArrowRight, IndianRupee, BarChart3, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<'salary' | 'cutoff'>('cutoff');

  // Salary Calc State
  const [salaryPosition, setSalaryPosition] = useState('SSC Inspector');
  const [salaryResult, setSalaryResult] = useState<any>(null);
  const [salaryLoading, setSalaryLoading] = useState(false);

  // Cutoff Predictor State
  const [cutoffExam, setCutoffExam] = useState('SSC CGL');
  const [cutoffCategory, setCutoffCategory] = useState('General');
  const [cutoffMarks, setCutoffMarks] = useState('');
  const [cutoffResult, setCutoffResult] = useState<any>(null);
  const [cutoffLoading, setCutoffLoading] = useState(false);

  const handleSalaryCalc = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalaryLoading(true);
    try {
      const { data } = await api.post('/engagement/salary-calculator', { position: salaryPosition });
      setSalaryResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSalaryLoading(false);
    }
  };

  const handleCutoffPredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cutoffMarks) return;
    setCutoffLoading(true);
    try {
      const { data } = await api.post('/engagement/predict-cutoff', { 
        exam: cutoffExam, 
        category: cutoffCategory, 
        expectedMarks: Number(cutoffMarks) 
      });
      setCutoffResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCutoffLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 bg-zinc-50 dark:bg-[#050505]">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Tool Selector */}
        <div className="flex flex-col items-center mb-16 space-y-6 text-center">
          <div className="inline-flex p-1.5 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-2xl backdrop-blur-xl">
            <button
              onClick={() => { setActiveTool('cutoff'); setCutoffResult(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTool === 'cutoff' 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Target size={18} /> Cut-off Predictor
            </button>
            <button
              onClick={() => { setActiveTool('salary'); setSalaryResult(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTool === 'salary' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Calculator size={18} /> Salary Calculator
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white mt-4 uppercase">
            {activeTool === 'cutoff' ? 'Score ' : 'Perks & ' }
            <span className={activeTool === 'cutoff' ? 'text-rose-500' : 'text-emerald-500'}>
              {activeTool === 'cutoff' ? 'Predictor' : 'Salary'}
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-lg">
            {activeTool === 'cutoff' 
              ? 'Input your expected marks and community polling will predict the real cut-off for your exam.' 
              : 'Calculate exactly how much you take home after taxes, allowances, and deductions for your dream job.'}
          </p>
        </div>

        {/* Tools Content */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden p-8 md:p-12">
          <AnimatePresence mode="wait">
            
            {/* Cutoff Predictor */}
            {activeTool === 'cutoff' && (
              <motion.div
                key="cutoff"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12"
              >
                <div>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
                    <Target className="text-rose-500" /> Enter Details
                  </h3>
                  <form onSubmit={handleCutoffPredict} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Exam</label>
                      <div className="relative">
                        <select 
                          value={cutoffExam} onChange={(e) => setCutoffExam(e.target.value)}
                          className="w-full appearance-none bg-zinc-50 dark:bg-black/50 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-4 pr-10 font-medium outline-none focus:border-rose-500 transition-colors cursor-pointer"
                        >
                          <option value="UPSC">UPSC Civil Services</option>
                          <option value="SSC CGL">SSC CGL</option>
                          <option value="RRB NTPC">RRB NTPC</option>
                          <option value="IBPS">IBPS PO/Clerk</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Category</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['General', 'OBC', 'SC', 'ST', 'EWS'].map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCutoffCategory(cat)}
                            className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                              cutoffCategory === cat 
                                ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-600 dark:text-rose-400' 
                                : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Expected Marks</label>
                      <input 
                        type="number"
                        placeholder="e.g. 135"
                        value={cutoffMarks}
                        onChange={(e) => setCutoffMarks(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-black/50 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-4 font-bold text-lg outline-none focus:border-rose-500 transition-colors"
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={cutoffLoading}
                      className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-rose-500/25 flex justify-center items-center gap-2"
                    >
                      {cutoffLoading ? 'Analyzing...' : 'Predict Cut-off'} <ArrowRight size={18} />
                    </button>
                  </form>
                </div>

                <div className="bg-rose-50 dark:bg-rose-900/10 rounded-3xl p-8 border border-rose-100 dark:border-rose-900/20 flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <BarChart3 size={150} />
                  </div>
                  
                  {cutoffResult ? (
                    <div className="relative z-10 text-center">
                      <div className="inline-block px-3 py-1 bg-white dark:bg-zinc-900 text-rose-600 font-bold rounded-full text-xs uppercase tracking-wider mb-6 shadow-sm border border-rose-100 dark:border-zinc-800">
                        {cutoffResult.exam} • {cutoffResult.category}
                      </div>
                      
                      <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-2">Community Predicted Cut-off</p>
                      <div className="text-6xl md:text-7xl font-black text-rose-600 tracking-tighter mb-4">
                        {cutoffResult.communityPredictedCutoff.min} - {cutoffResult.communityPredictedCutoff.max}
                      </div>
                      
                      <div className="flex justify-center items-center gap-3 text-sm font-bold text-zinc-600 dark:text-zinc-400 bg-white/50 dark:bg-black/20 p-4 rounded-xl mt-8">
                        Your Score: <span className="text-zinc-900 dark:text-white text-xl">{cutoffResult.userExpectedMarks}</span>
                      </div>
                      
                      <p className="text-xs font-semibold text-rose-500/70 mt-6 uppercase tracking-wider flex items-center justify-center gap-1">
                        Based on {cutoffResult.totalCommunityVotes + 1024} community estimates
                      </p>
                    </div>
                  ) : (
                    <div className="text-center relative z-10 opacity-60">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 text-rose-300 dark:text-rose-800" />
                      <p className="text-rose-800 dark:text-rose-200 font-medium max-w-[200px] mx-auto">Fill the details to view community-backed cut-off predictions.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Salary Calculator */}
            {activeTool === 'salary' && (
              <motion.div
                key="salary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12"
              >
                <div>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
                    <Calculator className="text-emerald-500" /> Select Position
                  </h3>
                  <form onSubmit={handleSalaryCalc} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Target Job</label>
                      <div className="relative">
                        <select 
                          value={salaryPosition} onChange={(e) => setSalaryPosition(e.target.value)}
                          className="w-full appearance-none bg-zinc-50 dark:bg-black/50 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-4 pr-10 font-bold outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                        >
                          <option value="SSC Inspector">SSC Inspector (Level 7)</option>
                          <option value="UPSC IAS">UPSC Civil Services (Level 10)</option>
                          <option value="Bank PO">Bank Probationary Officer</option>
                          <option value="Clerk">Lower Division Clerk (LDC)</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={18} />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={salaryLoading}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-500/25 flex justify-center items-center gap-2 mt-8"
                    >
                      {salaryLoading ? 'Calculating...' : 'Calculate In-Hand Salary'} <ArrowRight size={18} />
                    </button>
                  </form>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl p-8 border border-emerald-100 dark:border-emerald-900/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <IndianRupee size={200} />
                  </div>
                  
                  {salaryResult ? (
                    <div className="relative z-10">
                      <div className="text-center mb-8 pb-8 border-b border-emerald-200 dark:border-emerald-900/50">
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-2 uppercase text-sm tracking-wider">Estimated In-Hand Salary</p>
                        <div className="flex items-center justify-center text-5xl font-black text-emerald-600 tracking-tighter">
                          <IndianRupee size={36} strokeWidth={3} className="mr-1" />
                          {salaryResult.breakdown.inHandSalary.toLocaleString('en-IN')}
                        </div>
                        <p className="text-xs font-semibold text-emerald-500/70 mt-2 uppercase tracking-wider">Per Month</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Base Pay</span>
                          <span className="font-black text-zinc-900 dark:text-white">₹{salaryResult.breakdown.basePay.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Dearness Allowance (DA)</span>
                          <span className="font-black text-emerald-600">₹{salaryResult.breakdown.da.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">House Rent (HRA)</span>
                          <span className="font-black text-emerald-600">₹{salaryResult.breakdown.hra.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Transport (TA)</span>
                          <span className="font-black text-emerald-600">₹{salaryResult.breakdown.ta.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="h-px bg-emerald-200 dark:bg-emerald-900/50 my-2"></div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-zinc-900 dark:text-white uppercase tracking-wide">Gross Salary</span>
                          <span className="font-black text-zinc-900 dark:text-white">₹{salaryResult.breakdown.grossSalary.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-rose-500 uppercase tracking-wide">Deductions (NPS, etc.)</span>
                          <span className="font-black text-rose-500">-₹{salaryResult.breakdown.deductions.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center h-full flex flex-col justify-center relative z-10 opacity-60 min-h-[300px]">
                      <IndianRupee className="w-16 h-16 mx-auto mb-4 text-emerald-300 dark:text-emerald-800" />
                      <p className="text-emerald-800 dark:text-emerald-200 font-medium max-w-[200px] mx-auto">Select a position to view a detailed breakdown of salary and perks.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </main>
  );
}
