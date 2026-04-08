'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Job {
  _id: string;
  title: string;
  slug: string;
  organization: string;
  state: string;
  jobType: string;
  qualification: string;
  vacancy: { total: number };
  importantDates: { applicationEnd: string };
}

export default function DashboardHome() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEligibleJobs = async () => {
      try {
        const res = await api.get('/users/eligible-jobs');
        if (res.data.success) {
          setJobs(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load recommended jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchEligibleJobs();
  }, []);

  if (loading) return <div>Loading your personalized feed...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Jobs You Qualify For</h1>
          <p className="text-gray-600">Based on your Aspirant Profile</p>
        </div>
        <Link href="/dashboard/profile" className="text-blue-600 hover:underline text-sm">
          Edit Profile
        </Link>
      </div>

      {error ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">{error}</p>
          <div className="mt-4">
            <Link
              href="/dashboard/profile"
              className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded font-medium hover:bg-yellow-500 transition"
            >
              Complete Profile Now
            </Link>
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">We couldn't find any currently open jobs that match your exact profile.</p>
          <p className="text-sm text-gray-400">Make sure your profile is up to date, or check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow p-5 border border-gray-100 hover:shadow-md transition">
              <h3 className="font-bold text-lg text-blue-800 mb-2 line-clamp-2">
                <Link href={`/jobs/${job.slug}`} className="hover:underline">
                  {job.title}
                </Link>
              </h3>
              <p className="text-sm font-medium text-gray-700 mb-4">{job.organization}</p>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                <div><span className="font-medium">Qualification:</span> {job.qualification}</div>
                <div><span className="font-medium">Vacancies:</span> {job.vacancy?.total || 'N/A'}</div>
                <div><span className="font-medium">Location:</span> {job.state}</div>
                <div>
                  <span className="font-medium text-red-600">Deadline: </span> 
                  {job.importantDates?.applicationEnd 
                    ? new Date(job.importantDates.applicationEnd).toLocaleDateString() 
                    : 'N/A'}
                </div>
              </div>

              <div className="mt-5 text-right">
                <Link
                  href={`/jobs/${job.slug}`}
                  className="inline-block px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded hover:bg-blue-100 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
