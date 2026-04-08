'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function AspirantProfile() {
  const [profile, setProfile] = useState({
    dob: '',
    gender: '',
    category: '',
    qualification: '',
    state: '',
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
        if (res.data.success && res.data.data.profile) {
          const userProfile = res.data.data.profile;
          // Format date for inputs
          if (userProfile.dob) {
            userProfile.dob = new Date(userProfile.dob).toISOString().split('T')[0];
          }
          setProfile({
            ...profile,
            ...userProfile,
            physicalStats: userProfile.physicalStats || { heightCm: '', weightKg: '' },
          });
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('physicalStats.')) {
      const field = name.split('.')[1];
      setProfile({
        ...profile,
        physicalStats: {
          ...profile.physicalStats,
          [field]: value ? Number(value) : '',
        },
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/profile', { profile });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Aspirant Profile</h1>
      <p className="text-gray-600 mb-6">
        Complete your profile to let SarkariSetu automatically match you with eligible government jobs.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category / Caste</label>
            <select
              name="category"
              value={profile.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Select Category</option>
              <option value="General">General (UR)</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Qualification</label>
            <select
              name="qualification"
              value={profile.qualification}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              required
            >
              <option value="">Select Qualification</option>
              <option value="8th Pass">8th Pass</option>
              <option value="10th Pass">10th Pass</option>
              <option value="12th Pass">12th Pass</option>
              <option value="Diploma">Diploma</option>
              <option value="Graduate">Graduate / Degree</option>
              <option value="Post Graduate">Post Graduate / Master's</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Home State</label>
            <input
              type="text"
              name="state"
              value={profile.state}
              onChange={handleChange}
              placeholder="e.g. Maharashtra"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <hr className="my-6" />
        
        <h3 className="text-lg font-medium text-gray-800 mb-4">Physical Stats (Optional for Police/Defence)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
            <input
              type="number"
              name="physicalStats.heightCm"
              value={profile.physicalStats.heightCm}
              onChange={handleChange}
              placeholder="170"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              name="physicalStats.weightKg"
              value={profile.physicalStats.weightKg}
              onChange={handleChange}
              placeholder="65"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition disabled:bg-blue-400"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
