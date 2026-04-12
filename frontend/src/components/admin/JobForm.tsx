'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/api';
import { 
  Save, 
  X, 
  Upload, 
  Info, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Layout, 
  Search,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Wand2,
  Link as LinkIcon,
  AlignLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Modal from '@/components/admin/Modal';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false, 
  loading: () => <div className="h-64 bg-white/5 animate-pulse rounded-xl" /> 
});
import 'react-quill-new/dist/quill.snow.css';

interface JobFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function JobForm({ initialData, isEdit = false }: JobFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  
  // AI Section State
  const [aiInput, setAiInput] = useState({ url: '', text: '' });
  const [isAiExtracting, setIsAiExtracting] = useState(false);
  const [aiMode, setAiMode] = useState<'url' | 'text'>('url');
  
  // State management for the complex Job model
  const [formData, setFormData] = useState<any>(initialData || {
    title: '',
    organization: '',
    department: '',
    state: '',
    district: '',
    jobType: 'Central Government',
    category: '',
    qualification: 'Graduate',
    shortDescription: '',
    fullContent: '',
    notificationPdfUrl: '',
    applyOnlineUrl: '',
    officialWebsite: '',
    featuredImage: '',
    status: 'draft',
    isTrending: false,
    isFeatured: false,
    eligibility: {
      minAge: null,
      maxAge: null,
      ageRelaxation: '',
      qualifications: [''],
      experience: '',
      otherCriteria: ''
    },
    importantDates: {
      applicationStart: '',
      applicationEnd: '',
      examDate: '',
      customDates: []
    },
    applicationFee: {
      general: 0,
      obc: 0,
      scSt: 0,
      female: 0,
      paymentMode: 'Online'
    },
    vacancy: {
      total: 0,
      breakdown: []
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    
    // Handle nested fields (e.g., eligibility.minAge)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: finalValue
        }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev: any) => ({ ...prev, fullContent: content }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('sarkari_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sarkari-setu-1.onrender.com/api';
      
      const response = await axios.post(`${apiUrl}/upload/image`, uploadData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFormData((prev: any) => ({ ...prev, featuredImage: response.data.data.url }));
    } catch (err) {
      console.error('Upload failed', err);
      setModalContent({
        title: 'Upload Failed',
        message: 'Could not upload the image. Please verify your server configuration.'
      });
      setIsModalOpen(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAIExtract = async () => {
    if (!aiInput.url && !aiInput.text) {
      toast.error('Please provide a URL or paste text to extract from');
      return;
    }
    
    setIsAiExtracting(true);
    const toastId = toast.loading('AI is analyzing the notification...');
    
    try {
      let dataToMerge = null;

      if (aiMode === 'url') {
        // Advanced Pipeline using Background Queue
        const startRes = await api.post('/extract/start', { url: aiInput.url });
        const { trackingId } = startRes.data;
        
        let status = 'pending';
        while (status === 'pending' || status === 'processing') {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const checkRes = await api.get(`/extract/${trackingId}`);
          status = checkRes.data.data.status;
          
          if (status === 'completed') {
            dataToMerge = checkRes.data.data.resultData;
          } else if (status === 'failed') {
            throw new Error(checkRes.data.data.errorMessage || 'Extraction failed on server.');
          }
        }
      } else {
        // Direct synchronous pipeline for raw text
        const response = await api.post('/ai/extract-job', { text: aiInput.text });
        dataToMerge = response.data.data;
      }
      
      if (dataToMerge) {
        setFormData((prev: any) => ({
          ...prev,
          ...dataToMerge,
          eligibility: {
            ...prev.eligibility,
            ...dataToMerge.eligibility
          },
          importantDates: {
            ...prev.importantDates,
            ...dataToMerge.importantDates
          },
          applicationFee: {
            ...prev.applicationFee,
            ...dataToMerge.applicationFee
          },
          vacancy: {
            ...prev.vacancy,
            ...dataToMerge.vacancy
          },
          seo: {
            ...prev.seo,
            ...dataToMerge.seo
          }
        }));
        
        toast.success('Job details extracted successfully!', { id: toastId });
        toast('Please review the auto-filled data before saving.', { icon: '🤖' });
      }
    } catch (err: any) {
      console.error('AI Extraction failed', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to extract data. Please manually enter details.', { id: toastId });
    } finally {
      setIsAiExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.patch(`/jobs/${initialData._id}`, formData);
      } else {
        await api.post('/jobs', formData);
      }
      router.push('/admin/jobs');
      router.refresh();
    } catch (err: any) {
      console.error('Submission failed', err);
      setModalContent({
        title: 'Validation Error',
        message: err.response?.data?.message || 'There was an issue saving this job post. Please ensure all mandatory fields are correctly filled.'
      });
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'content', label: 'Job Content', icon: Layout },
    { id: 'details', label: 'Eligibility & Fees', icon: CreditCard },
    { id: 'dates', label: 'Important Dates', icon: Calendar },
    { id: 'seo', label: 'SEO Config', icon: Search },
  ];

  return (
    <div className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      {/* Form Header */}
      <div className="px-8 py-6 border-b border-white/5 bg-[#16161a] flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isEdit ? 'Update Job Position' : 'Compose New Job Listing'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">Configure all details for the recruitment posting</p>
        </div>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Save Changes' : 'Publish Job'}
          </button>
        </div>
      </div>

      {/* AI Extraction Panel */}
      {!isEdit && (
        <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-transparent border-b border-white/5 p-6 md:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-bold text-lg">AI Auto-Fill</h3>
              </div>
              <p className="text-gray-400 text-sm">Let Gemini extract details instantly</p>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div className="flex bg-[#0a0a0b] border border-white/10 rounded-xl p-1 w-fit">
                <button
                  type="button"
                  onClick={() => setAiMode('url')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${aiMode === 'url' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <LinkIcon className="w-4 h-4" /> URL Link
                </button>
                <button
                  type="button"
                  onClick={() => setAiMode('text')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${aiMode === 'text' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <AlignLeft className="w-4 h-4" /> Raw Text
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                {aiMode === 'url' ? (
                  <input
                    type="url"
                    placeholder="Paste official notification URL..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={aiInput.url}
                    onChange={(e) => setAiInput({ ...aiInput, url: e.target.value })}
                  />
                ) : (
                  <textarea
                    placeholder="Paste raw notification text..."
                    rows={2}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y min-h-[46px]"
                    value={aiInput.text}
                    onChange={(e) => setAiInput({ ...aiInput, text: e.target.value })}
                  />
                )}
                
                <button
                  type="button"
                  onClick={handleAIExtract}
                  disabled={isAiExtracting || (!aiInput.url && !aiInput.text)}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap h-fit"
                >
                  {isAiExtracting ? <Loader2 className="w-5 h-5 animate-spin text-blue-400" /> : <Wand2 className="w-5 h-5 text-blue-400" />}
                  {isAiExtracting ? 'Extracting...' : 'Extract & Fill'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Navigation */}
      <div className="flex border-b border-white/5 bg-[#0a0a0b]/40 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-5 text-sm font-semibold transition-all relative shrink-0 ${
              activeTab === tab.id ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-600'}`} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-10 space-y-10">
        <AnimatePresence mode="wait">
          {activeTab === 'basic' && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. SSC MTS Recruitment 2026"
                  required
                  className="w-full bg-white/5 border border-white/5 py-4 px-6 rounded-2xl text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/5 py-3.5 px-5 rounded-2xl text-white focus:outline-none transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full bg-[#16161a] border border-white/5 py-3.5 px-5 rounded-2xl text-white focus:outline-none transition-all"
                >
                  <option>Central Government</option>
                  <option>State Government</option>
                  <option>PSU</option>
                  <option>Railway</option>
                  <option>Banking</option>
                  <option>Defence</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">State / Territory</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/5 py-3.5 px-5 rounded-2xl text-white focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Qualification</label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full bg-[#16161a] border border-white/5 py-3.5 px-5 rounded-2xl text-white focus:outline-none transition-all"
                >
                  <option>10th Pass</option>
                  <option>12th Pass</option>
                  <option>Diploma</option>
                  <option>Graduate</option>
                  <option>Post Graduate</option>
                </select>
              </div>

              <div className="col-span-2 space-y-6 mt-4">
                <div className="flex items-center gap-4">
                   <div className="flex-1 h-px bg-white/5" />
                   <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Featured Media</span>
                   <div className="flex-1 h-px bg-white/5" />
                </div>

                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02] group hover:bg-white/[0.04] transition-all relative">
                  {formData.featuredImage ? (
                    <div className="w-full h-64 relative rounded-2xl overflow-hidden mb-6 group-hover:scale-[1.01] transition-transform duration-500">
                      <img src={formData.featuredImage} className="w-full h-full object-cover" alt="Featured" />
                      <button 
                        type="button"
                        onClick={() => setFormData((p: any) => ({ ...p, featuredImage: '' }))}
                        className="absolute top-4 right-4 bg-red-600 p-2 rounded-xl text-white hover:bg-red-500 shadow-xl opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-all duration-500">
                        {isUploading ? <Loader2 className="w-10 h-10 animate-spin" /> : <ImageIcon className="w-10 h-10" />}
                      </div>
                      <p className="text-white font-bold text-lg">Click or Drag Image</p>
                      <p className="text-gray-500 text-sm mt-1 mb-8">PNG, JPG or WEBP (Max: 5MB)</p>
                      <label className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-bold text-white rounded-xl transition-all cursor-pointer">
                        Choose File
                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Short Description (Cards & Search)</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-white/5 border border-white/5 py-4 px-6 rounded-2xl text-white focus:outline-none transition-all resize-none"
                  placeholder="Write a catchy 2-3 sentence summary..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Full Detailed Content (Editor)</label>
                  <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">
                    HTML Support Enabled
                  </span>
                </div>
                <div className="bg-white rounded-3xl overflow-hidden glass-editor min-h-[400px]">
                  <ReactQuill 
                    theme="snow"
                    value={formData.fullContent}
                    onChange={handleEditorChange}
                    className="h-[350px] border-none text-black"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                        ['link', 'image', 'clean']
                      ]
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">PDF Notification URL</label>
                  <input
                    type="url"
                    name="notificationPdfUrl"
                    value={formData.notificationPdfUrl}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/5 py-3.5 px-5 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Apply Online URL</label>
                  <input
                    type="url"
                    name="applyOnlineUrl"
                    value={formData.applyOnlineUrl}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/5 py-3.5 px-5 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'details' && (
             <motion.div
                key="details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
             >
                <div className="bg-[#16161a] rounded-3xl p-8 border border-white/5">
                   <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4">Age Eligibility</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Min Age</label>
                        <input type="number" name="eligibility.minAge" value={formData.eligibility?.minAge ?? ''} onChange={handleChange} className="w-full bg-white/5 border border-white/5 py-3 px-4 rounded-xl text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Max Age</label>
                        <input type="number" name="eligibility.maxAge" value={formData.eligibility?.maxAge ?? ''} onChange={handleChange} className="w-full bg-white/5 border border-white/5 py-3 px-4 rounded-xl text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Age Relaxation Info</label>
                        <input type="text" name="eligibility.ageRelaxation" value={formData.eligibility.ageRelaxation} onChange={handleChange} placeholder="As per rules" className="w-full bg-white/5 border border-white/5 py-3 px-4 rounded-xl text-white" />
                      </div>
                   </div>
                </div>

                <div className="bg-[#16161a] rounded-3xl p-8 border border-white/5">
                   <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4">Application Fee (INR)</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {['general', 'obc', 'scSt', 'female'].map((cat) => (
                        <div key={cat} className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 capitalize">{cat}</label>
                          <input type="number" name={`applicationFee.${cat}`} value={formData.applicationFee[cat] ?? ''} onChange={handleChange} className="w-full bg-white/5 border border-white/5 py-3 px-4 rounded-xl text-white font-mono" />
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-[#16161a] rounded-3xl p-8 border border-white/5">
                   <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                     <h3 className="text-xl font-bold text-white">Vacancy Breakdown</h3>
                     <div className="space-y-1 text-right">
                        <label className="text-xs font-bold text-gray-500 uppercase">Total Posts</label>
                        <input type="number" name="vacancy.total" value={formData.vacancy?.total ?? ''} onChange={handleChange} className="bg-transparent text-right text-2xl font-black text-blue-500 focus:outline-none w-32" />
                     </div>
                   </div>
                   
                   <div className="space-y-4">
                     {formData.vacancy.breakdown?.map((item: any, idx: number) => (
                       <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 group">
                         <div className="flex-1 w-full space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category / Post Name</label>
                            <input 
                              type="text" 
                              value={item.post || ''}
                              onChange={(e) => {
                                const newBreakdown = [...(formData.vacancy.breakdown || [])];
                                newBreakdown[idx].post = e.target.value;
                                setFormData((prev: any) => ({ ...prev, vacancy: { ...prev.vacancy, breakdown: newBreakdown } }));
                              }}
                              placeholder="e.g. General, UR, Inspector, Clerk..."
                              className="w-full bg-[#0a0a0b] border border-white/10 py-3.5 px-5 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                            />
                         </div>
                         <div className="w-full sm:w-32 space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Count</label>
                            <input 
                              type="number" 
                              value={item.count === 0 ? '' : item.count}
                              onChange={(e) => {
                                const newBreakdown = [...(formData.vacancy.breakdown || [])];
                                newBreakdown[idx].count = parseInt(e.target.value) || 0;
                                setFormData((prev: any) => ({ ...prev, vacancy: { ...prev.vacancy, breakdown: newBreakdown } }));
                                
                                // Auto-update total count calculation based on breakdown sum
                                const newTotal = newBreakdown.reduce((sum, item) => sum + (parseInt(item.count) || 0), 0);
                                if (newTotal > 0) {
                                  setFormData((prev: any) => ({ ...prev, vacancy: { ...prev.vacancy, total: newTotal } }));
                                }
                              }}
                              placeholder="0"
                              className="w-full bg-[#0a0a0b] border border-white/10 py-3.5 px-5 rounded-xl text-white font-mono outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-center"
                            />
                         </div>
                         <div className="pt-6 sm:pt-0">
                           <button
                             type="button"
                             onClick={() => {
                               const newBreakdown = formData.vacancy.breakdown.filter((_: any, i: number) => i !== idx);
                               setFormData((prev: any) => ({ ...prev, vacancy: { ...prev.vacancy, breakdown: newBreakdown } }));
                               
                               const newTotal = newBreakdown.reduce((sum: number, item: any) => sum + (parseInt(item.count) || 0), 0);
                               setFormData((prev: any) => ({ ...prev, vacancy: { ...prev.vacancy, total: newTotal } }));
                             }}
                             className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-3.5 rounded-xl transition-all sm:mt-6 cursor-pointer"
                           >
                             <Trash2 className="w-5 h-5" />
                           </button>
                         </div>
                       </div>
                     ))}
                     
                     <button
                       type="button"
                       onClick={() => {
                         const newBreakdown = [...(formData.vacancy.breakdown || []), { post: '', count: 0 }];
                         setFormData((prev: any) => ({ ...prev, vacancy: { ...prev.vacancy, breakdown: newBreakdown } }));
                       }}
                       className="w-full py-4 border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-2xl text-gray-400 font-bold hover:text-blue-400 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                     >
                       <Plus className="w-5 h-5 group-hover:scale-125 transition-all" /> Add Vacancy Detail
                     </button>
                   </div>
                </div>
             </motion.div>
          )}

          {activeTab === 'dates' && (
            <motion.div
              key="dates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-10"
            >
              {[
                { name: 'applicationStart', label: 'Application Open Date' },
                { name: 'applicationEnd', label: 'Application Close Date (Deadline)' },
                { name: 'examDate', label: 'Exam Date (Tentative)' },
              ].map((date) => (
                <div key={date.name} className="bg-[#16161a] p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:text-blue-500 group-hover:bg-blue-600/10 transition-all">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <label className="font-bold text-lg text-white">{date.label}</label>
                  </div>
                  <input
                    type="date"
                    name={`importantDates.${date.name}`}
                    value={formData.importantDates[date.name] ? new Date(formData.importantDates[date.name]).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0b] border border-white/10 py-5 px-6 rounded-2xl text-white font-mono uppercase text-sm tracking-widest focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'seo' && (
            <motion.div
              key="seo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="bg-[#16161a] p-10 rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-10 flex items-center gap-3">
                  <Search className="w-6 h-6 text-blue-500" />
                  Google Search Preview
                </h3>
                
                <div className="space-y-2 mb-12">
                  <p className="text-[#1a0dab] text-xl hover:underline cursor-pointer truncate">
                    {formData.seo.metaTitle || (formData.title ? `${formData.title} | SarkariSetu` : 'Job Title | SarkariSetu')}
                  </p>
                  <p className="text-[#006621] text-sm truncate">
                    https://sarkarisetu.com/jobs/{formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'slug'}
                  </p>
                  <p className="text-gray-400 text-sm line-clamp-2 max-w-2xl">
                    {formData.seo.metaDescription || (formData.shortDescription || 'Search results summary snippet will appear here...')}
                  </p>
                </div>

                <div className="space-y-8 border-t border-white/5 pt-10">
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Meta Title</label>
                    <input
                      type="text"
                      name="seo.metaTitle"
                      value={formData.seo?.metaTitle ?? ''}
                      onChange={handleChange}
                      placeholder="Title tag for search engines"
                      className="w-full bg-[#0a0a0b] border border-white/10 py-4 px-6 rounded-2xl text-white focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Meta Description</label>
                    <textarea
                      name="seo.metaDescription"
                      value={formData.seo?.metaDescription ?? ''}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Short summary for search results (Max 160 chars)"
                      className="w-full bg-[#0a0a0b] border border-white/10 py-4 px-6 rounded-2xl text-white focus:outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-blue-600/5 rounded-3xl border border-blue-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-white">Auto-fill Enabled</h4>
                    <p className="text-xs text-gray-500">Leaving meta fields empty will trigger auto-generation on publish.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-10 border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} className="w-5 h-5 rounded-lg border-white/10 bg-[#16161a] text-blue-600 focus:ring-blue-500/20" />
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-all">Mark as Trending</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded-lg border-white/10 bg-[#16161a] text-blue-600 focus:ring-blue-500/20" />
                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-all">Featured Pin</span>
              </label>
           </div>
           
           <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-widest mr-2">Publish Status:</span>
              <div className="flex p-1 bg-[#0a0a0b] border border-white/5 rounded-2xl">
                 <button 
                  type="button" 
                  onClick={() => setFormData((p: any) => ({ ...p, status: 'draft' }))}
                  className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    formData.status === 'draft' ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/20' : 'text-gray-500 hover:text-white'
                  }`}
                 >
                   Draft
                 </button>
                 <button 
                  type="button" 
                  onClick={() => setFormData((p: any) => ({ ...p, status: 'published' }))}
                  className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    formData.status === 'published' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-gray-500 hover:text-white'
                  }`}
                 >
                   Published
                 </button>
              </div>
           </div>
        </div>
      </form>

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
            Acknowledge
          </button>
        </div>
      </Modal>

      <style jsx global>{`
        .glass-editor .ql-toolbar.ql-snow {
          border: none;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 8px 20px;
          border-radius: 20px 20px 0 0;
        }
        .glass-editor .ql-container.ql-snow {
          border: none;
          font-size: 16px;
          min-height: 350px;
        }
        .glass-editor .ql-editor {
          padding: 30px;
          min-height: 350px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
