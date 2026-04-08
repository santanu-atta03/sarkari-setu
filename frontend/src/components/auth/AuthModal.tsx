'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email) return toast.error('Please enter your email');
    
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/send-otp`, { email });
      if (res.data.success) {
        toast.success('OTP sent to your email');
        setStep('otp');
        setCountdown(60);
        if (res.data.otp) {
            console.log("DEV ONLY - OTP:", res.data.otp);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter the OTP');
    
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
      if (res.data.success) {
        toast.success('Signed in successfully');
        localStorage.setItem('sarkari_token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onClose();
        window.location.reload(); 
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return;
    
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/google-login`, { 
        tokenId: response.credential 
      });
      if (res.data.success) {
        toast.success('Google signed in successfully');
        localStorage.setItem('sarkari_token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onClose();
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-[#0a0a0b] rounded-3xl shadow-2xl overflow-hidden border border-black/5 dark:border-white/5"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-black dark:hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="p-8 pt-12">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-blue-500/30">
                  S
                </div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {step === 'email' ? 'Welcome back' : 'Check your inbox'}
                </h2>
                <p className="text-zinc-500 text-sm mt-2">
                  {step === 'email' 
                    ? 'Sign in to access personalized features and notifications' 
                    : `We've sent a code to ${email}`}
                </p>
              </div>

              {step === 'email' ? (
                <div className="space-y-4">
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-100 dark:bg-white/5 border border-transparent focus:border-blue-500 rounded-2xl text-sm font-bold focus:outline-none transition-all dark:text-white"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Continue'}
                      <ArrowRight size={18} />
                    </button>
                  </form>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-[#0a0a0b] px-2 text-zinc-500 font-bold">Or continue with</span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error('Google Sign In failed')}
                      theme="filled_blue"
                      shape="pill"
                      width="350"
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                      type="text"
                      placeholder="······"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-100 dark:bg-white/5 border border-transparent focus:border-blue-500 rounded-2xl text-lg font-black text-center tracking-[1em] focus:outline-none transition-all dark:text-white"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Verify & Sign In'}
                  </button>
                  
                  <div className="text-center flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStep('email')}
                      className="text-zinc-500 hover:text-blue-600 text-xs font-bold transition-colors"
                    >
                      Change email
                    </button>
                    <span className="text-zinc-800 dark:text-zinc-700 font-bold">•</span>
                    <button
                      type="button"
                      disabled={countdown > 0}
                      onClick={() => handleSendOTP()}
                      className="text-blue-600 disabled:text-zinc-500 text-xs font-bold transition-colors"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
                    </button>
                  </div>
                </form>
              )}
            </div>
            
            <div className="p-8 bg-zinc-50 dark:bg-white/5 border-t border-black/5 dark:border-white/5">
              <p className="text-[10px] text-center text-zinc-500 leading-relaxed uppercase tracking-widest font-bold">
                By continuing, you agree to our <span className="text-zinc-900 dark:text-white underline cursor-pointer">Terms</span> and <span className="text-zinc-900 dark:text-white underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
