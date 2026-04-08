'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
// No date-fns import needed

interface JobReference {
  _id: string;
  title: string;
  slug: string;
  organization: string;
  importantDates: {
    applicationEnd?: string;
    admitCardDate?: string;
    examDate?: string;
    resultDate?: string;
  };
  admitCardUrl?: string;
  resultUrl?: string;
}

interface Application {
  _id: string;
  jobId: JobReference;
  appliedAt: string;
  applicationNumber: string;
  customStatus: string;
}

export default function MyApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/users/applications');
        if (res.data.success) {
          setApps(res.data.data);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) return <div>Loading exam timeline...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Exam Tracker</h1>
      
      {apps.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">You haven't added any applications to your tracker yet.</p>
          <Link href="/jobs" className="mt-4 inline-block text-blue-600 hover:underline">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {apps.map((app) => {
            const job = app.jobId;
            if (!job) return null;

            return (
              <div key={app._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-blue-800">
                      <Link href={`/jobs/${job.slug}`} className="hover:underline">
                        {job.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600">{job.organization}</p>
                  </div>
                  {app.applicationNumber && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-mono">
                      App #: {app.applicationNumber}
                    </span>
                  )}
                </div>

                {/* Timeline UI */}
                <div className="relative pt-4">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-between">
                    {/* Stage 1: Applied */}
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center ring-4 ring-white">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="mt-2 text-xs font-semibold text-blue-600">Applied</span>
                      <span className="text-[10px] text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>

                    {/* Stage 2: Admit Card */}
                    <div className="flex flex-col items-center">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-white ${job.admitCardUrl ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        {job.admitCardUrl && <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`mt-2 text-xs font-semibold ${job.admitCardUrl ? 'text-blue-600' : 'text-gray-500'}`}>Admit Card</span>
                      {job.importantDates?.admitCardDate && (
                        <span className="text-[10px] text-gray-500">{new Date(job.importantDates.admitCardDate).toLocaleDateString()}</span>
                      )}
                      {job.admitCardUrl && (
                        <a href={job.admitCardUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline mt-1 border border-blue-600 rounded px-1">Download</a>
                      )}
                    </div>

                    {/* Stage 3: Exam Date */}
                    <div className="flex flex-col items-center">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-white ${job.importantDates?.examDate && new Date(job.importantDates.examDate) < new Date() ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      </div>
                      <span className={`mt-2 text-xs font-semibold ${job.importantDates?.examDate ? 'text-gray-800' : 'text-gray-500'}`}>Exam</span>
                      {job.importantDates?.examDate && (
                        <span className="text-[10px] text-gray-500">{new Date(job.importantDates.examDate).toLocaleDateString()}</span>
                      )}
                    </div>

                    {/* Stage 4: Result */}
                    <div className="flex flex-col items-center">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-white ${job.resultUrl ? 'bg-green-500' : 'bg-gray-300'}`}>
                        {job.resultUrl && <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`mt-2 text-xs font-semibold ${job.resultUrl ? 'text-green-600' : 'text-gray-500'}`}>Result Out</span>
                      {job.importantDates?.resultDate && (
                        <span className="text-[10px] text-gray-500">{new Date(job.importantDates.resultDate).toLocaleDateString()}</span>
                      )}
                      {job.resultUrl && (
                        <a href={job.resultUrl} target="_blank" rel="noreferrer" className="text-[10px] text-green-600 hover:underline mt-1 border border-green-500 rounded px-1">Check</a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
