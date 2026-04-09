'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Target, 
  Calendar, 
  MapPin, 
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown
} from 'lucide-react';

// --- Custom Components for Premium UI ---

const PremiumSelect = ({ label, value, options, onChange, icon: Icon, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-3 relative">
      {label && <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between pl-14 pr-6 py-4 rounded-[24px] border border-black/5 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold text-zinc-800 dark:text-white text-left ${isOpen ? 'ring-4 ring-blue-500/10 border-blue-500' : ''}`}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />}
            <span className={value ? 'text-zinc-800 dark:text-white' : 'text-zinc-400'}>
              {value || placeholder}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60]" 
                onClick={() => setIsOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-[#121214] border border-black/5 dark:border-white/10 rounded-[24px] shadow-2xl z-[70] max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800"
              >
                {options.map((opt: string) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center px-6 py-3 rounded-[16px] text-sm font-bold transition-all ${
                      value === opt 
                        ? 'bg-blue-600 text-white' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PremiumDatePicker = ({ label, value, onChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDay = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));

  const years = Array.from({ length: 80 }, (_, i) => 2026 - i);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="space-y-3 relative">
      <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-3 pl-14 pr-6 py-4 rounded-[24px] border border-black/5 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold text-zinc-800 dark:text-white text-left ${isOpen ? 'ring-4 ring-blue-500/10 border-blue-500' : ''}`}
        >
          <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <span className={value ? 'text-zinc-800 dark:text-white' : 'text-zinc-400'}>
            {value ? new Date(value).toLocaleDateString('en-GB') : 'DD/MM/YYYY'}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60]" 
                onClick={() => setIsOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-full left-0 mt-2 p-6 bg-white dark:bg-[#121214] border border-black/5 dark:border-white/10 rounded-[32px] shadow-2xl z-[70] w-80"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    <select 
                      value={viewDate.getMonth()} 
                      onChange={(e) => setViewDate(new Date(viewDate.getFullYear(), parseInt(e.target.value)))}
                      className="bg-transparent text-sm font-black text-zinc-800 dark:text-white outline-none cursor-pointer"
                    >
                      {months.map((m, i) => <option key={m} value={i} className="bg-white dark:bg-zinc-900">{m}</option>)}
                    </select>
                    <select 
                      value={viewDate.getFullYear()} 
                      onChange={(e) => setViewDate(new Date(parseInt(e.target.value), viewDate.getMonth()))}
                      className="bg-transparent text-sm font-black text-zinc-800 dark:text-white outline-none cursor-pointer"
                    >
                      {years.map(y => <option key={y} value={y} className="bg-white dark:bg-zinc-900">{y}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={handlePrevMonth} className="p-2 hover:bg-black/5 rounded-full dark:text-zinc-400 font-bold">&larr;</button>
                    <button type="button" onClick={handleNextMonth} className="p-2 hover:bg-black/5 rounded-full dark:text-zinc-400 font-bold">&rarr;</button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <span key={d} className="text-[10px] font-black text-zinc-400 uppercase">{d}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startDay(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isSelected = value === dateStr;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          onChange(dateStr);
                          setIsOpen(false);
                        }}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-blue-600/10 hover:text-blue-600'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function AspirantProfile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    avatar: '',
  });
  const [profile, setProfile] = useState({
    dob: '',
    gender: '',
    category: '',
    qualification: '',
    state: '',
    profession: '',
    preferredJobType: '',
    preparingFor: '',
    physicalStats: {
      heightCm: '',
      weightKg: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success) {
          const { name, email, avatar, profile: userProfile } = res.data.data;
          setUserData({ name: name || '', email: email || '', avatar: avatar || '' });
          
          if (userProfile) {
            const formattedProfile = { ...userProfile };
            if (formattedProfile.dob) {
              formattedProfile.dob = new Date(formattedProfile.dob).toISOString().split('T')[0];
            }
            setProfile((prev) => ({
              ...prev,
              ...formattedProfile,
              physicalStats: formattedProfile.physicalStats || { heightCm: '', weightKg: '' },
            }));
          }
        }
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('physicalStats.')) {
      const field = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        physicalStats: {
          ...prev.physicalStats,
          [field]: value ? Number(value) : '',
        },
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = () => {
    const newAvatar = prompt('Enter image URL for avatar:', userData.avatar);
    if (newAvatar !== null) {
      setUserData(prev => ({ ...prev, avatar: newAvatar }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/profile', { 
        name: userData.name,
        avatar: userData.avatar,
        profile 
      });
      toast.success('Your profile has been saved in real-time!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  const professions = [
    "Full-time Aspirant",
    "College Student",
    "Private Sector Employee",
    "Government Employee",
    "Self-employed",
    "Unemployed",
    "Freelancer"
  ];

  const targetExams = [
    "UPSC Civil Services",
    "SSC CGL / CHSL / MTS",
    "Banking (SBI / IBPS PO & Clerk)",
    "Railway (RRB NTPC / Group D)",
    "Defence (NDA / CDS / AFCAT)",
    "State PSC",
    "Police Services",
    "Teaching (TET / NET)",
    "Engineering Services (GATE / IES)"
  ];

  const genders = ["Male", "Female", "Other"];
  const qualifications = ["8th Pass", "10th Pass", "12th Pass", "Diploma", "Graduate", "Post Graduate", "PhD"];
  const categories = ["General", "OBC", "SC", "ST", "EWS"];
  const jobTypes = ["Central Government", "State Government", "PSU", "Banking", "Defence/Police", "Any"];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header Section */}
      <div className="rounded-[40px] overflow-hidden mb-12 border border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md shadow-xl">
        <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>
        <div className="px-10 pb-10 -mt-16 relative">
          <div className="flex flex-col md:flex-row items-end gap-8">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[40px] border-8 border-white dark:border-zinc-900 shadow-2xl overflow-hidden bg-white">
                <img 
                  src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=random`} 
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={handleAvatarChange}
                type="button"
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[40px] text-white backdrop-blur-sm"
              >
                <Camera className="w-10 h-10" />
              </button>
            </div>
            <div className="flex-1 mb-4">
              <div className="flex items-center gap-3 mb-2">
                 <span className="px-3 py-1 bg-blue-600/10 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-600/20">Aspirant Profile</span>
              </div>
              <h1 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none mb-4">{userData.name || 'Aspirant'}</h1>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                {profile.preparingFor || 'Goal-driven Aspirant'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Basic Information */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 shadow-lg shadow-blue-600/5">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">Identity Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleUserChange}
                placeholder="Enter your full name"
                className="w-full px-6 py-4 rounded-[24px] border border-black/5 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-zinc-800 dark:text-white"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Email (Primary Identification)</label>
              <input
                type="email"
                value={userData.email}
                disabled
                className="w-full px-6 py-4 rounded-[24px] border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-zinc-400 cursor-not-allowed outline-none font-bold"
              />
            </div>
            <PremiumDatePicker 
              label="Date of Birth"
              value={profile.dob}
              onChange={(val: string) => setProfile(prev => ({ ...prev, dob: val }))}
            />
            <PremiumSelect 
              label="Gender Identification"
              value={profile.gender}
              options={genders}
              onChange={(val: string) => setProfile(prev => ({ ...prev, gender: val }))}
              placeholder="Select Gender"
            />
          </div>
        </section>

        {/* Education & Career */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-green-600/10 flex items-center justify-center text-green-600 shadow-lg shadow-green-600/5">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">Academic & Goals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PremiumSelect 
              label="Highest Qualification"
              value={profile.qualification}
              options={qualifications}
              onChange={(val: string) => setProfile(prev => ({ ...prev, qualification: val }))}
              placeholder="Select Qualification"
            />
            <PremiumSelect 
              label="Current Profession"
              value={profile.profession}
              options={professions}
              onChange={(val: string) => setProfile(prev => ({ ...prev, profession: val }))}
              icon={Briefcase}
              placeholder="Select Profession"
            />
            <div className="md:col-span-2">
              <PremiumSelect 
                label="Primary Target Examination"
                value={profile.preparingFor}
                options={targetExams}
                onChange={(val: string) => setProfile(prev => ({ ...prev, preparingFor: val }))}
                icon={Target}
                placeholder="Select Target Exam"
              />
            </div>
          </div>
        </section>

        {/* Job Preferences & Location */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-600 shadow-lg shadow-purple-600/5">
              <MapPin className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">Territory & Sector</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PremiumSelect 
              label="Preferred Job Category"
              value={profile.preferredJobType}
              options={jobTypes}
              onChange={(val: string) => setProfile(prev => ({ ...prev, preferredJobType: val }))}
              placeholder="Select Sector"
            />
            <div className="space-y-3">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Home Residency State</label>
              <input
                type="text"
                name="state"
                value={profile.state}
                onChange={handleProfileChange}
                placeholder="e.g. Uttar Pradesh"
                className="w-full px-6 py-4 rounded-[24px] border border-black/5 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-zinc-800 dark:text-white"
              />
            </div>
            <PremiumSelect 
              label="Caste / Category (For Eligibility)"
              value={profile.category}
              options={categories}
              onChange={(val: string) => setProfile(prev => ({ ...prev, category: val }))}
              placeholder="Select Category"
            />
          </div>
        </section>

        {/* Physical Stats (Optional) */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/10 flex items-center justify-center text-rose-600 shadow-lg shadow-rose-600/5">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">Physical Metrics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Height (cm)</label>
              <input
                type="number"
                name="physicalStats.heightCm"
                value={profile.physicalStats.heightCm}
                onChange={handleProfileChange}
                placeholder="170"
                className="w-full px-6 py-4 rounded-[24px] border border-black/5 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-zinc-800 dark:text-white"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Weight (kg)</label>
              <input
                type="number"
                name="physicalStats.weightKg"
                value={profile.physicalStats.weightKg}
                onChange={handleProfileChange}
                placeholder="65"
                className="w-full px-6 py-4 rounded-[24px] border border-black/5 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-zinc-800 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="pt-10 flex justify-center sticky bottom-0 z-20 pb-4">
          <button
            type="submit"
            disabled={saving}
            className={`
              flex items-center gap-4 px-12 py-5 rounded-full text-sm font-black uppercase tracking-widest shadow-2xl transition-all duration-300 transform active:scale-95
              ${saving 
                ? 'bg-zinc-400 cursor-not-allowed text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/40 hover:-translate-y-1'
              }
            `}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Syncing Real-time...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Push Update to Cloud
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
