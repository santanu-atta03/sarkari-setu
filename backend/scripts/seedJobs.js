const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../src/models/Job');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sampleJobs = [
  {
    title: 'UPSC Civil Services Examination 2026',
    organization: 'Union Public Service Commission',
    state: 'All India',
    jobType: 'Central Government',
    qualification: 'Graduate',
    shortDescription: 'The UPSC Civil Services Examination (CSE) is a nationwide competitive examination in India conducted by the Union Public Service Commission for recruitment to various Civil Services of the Government of India.',
    status: 'published',
    isTrending: true,
    viewCount: 15420,
    admitCardUrl: 'https://upsc.gov.in/admit-card',
    importantDates: {
      applicationEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      examDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), 
    },
    vacancy: { total: 1056 },
    featuredImage: 'https://images.unsplash.com/photo-1589209249848-21df30996214?auto=format&fit=crop&q=80&w=1000',
    trendingScore: 852.4
  },
  {
    title: 'SSC CGL Recruitment 2026',
    organization: 'Staff Selection Commission',
    state: 'All India',
    jobType: 'Central Government',
    qualification: 'Graduate',
    shortDescription: 'SSC CGL (Combined Graduate Level) is one of the most prestigious exams conducted by the Staff Selection Commission for recruitment to Group B and Group C posts in various ministries.',
    status: 'published',
    isTrending: true,
    viewCount: 22840,
    importantDates: {
      applicationEnd: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Ended 2 days ago
      examDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    vacancy: { total: 17727 },
    featuredImage: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=80&w=1000',
    trendingScore: 941.2
  },
  {
    title: 'Railway RPF SI & Constable',
    organization: 'Railway Recruitment Boards',
    state: 'All India',
    jobType: 'Railway',
    qualification: '10th Pass',
    shortDescription: 'RRB is recruiting for Sub-Inspectors and Constables for the Railway Protection Force (RPF) across multiple zones in India.',
    status: 'published',
    isTrending: true,
    viewCount: 18210,
    resultUrl: 'https://rrbcdg.gov.in/results',
    importantDates: {
      applicationEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days (urgent)
    },
    vacancy: { total: 4660 },
    featuredImage: 'https://images.unsplash.com/photo-1474487094121-b8833c69d3f0?auto=format&fit=crop&q=80&w=1000',
    trendingScore: 720.8
  },
  {
    title: 'SBI PO Recruitment 2026',
    organization: 'State Bank of India',
    state: 'All India',
    jobType: 'Banking',
    qualification: 'Graduate',
    shortDescription: 'State Bank of India (SBI) invites applications for the recruitment of Probationary Officers (PO) for its various branches across India.',
    status: 'published',
    isTrending: false,
    viewCount: 12100,
    importantDates: {
      applicationEnd: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    },
    vacancy: { total: 2000 },
    featuredImage: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=1000',
    trendingScore: 450.5
  },
  {
    title: 'IBPS Clerk XIV Vacancy',
    organization: 'Institute of Banking Personnel Selection',
    state: 'All India',
    jobType: 'Banking',
    qualification: 'Graduate',
    shortDescription: 'IBPS has released the notification for the recruitment of Clerks in participating banks across the country.',
    status: 'published',
    isTrending: true,
    viewCount: 9400,
    importantDates: {
      applicationEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    vacancy: { total: 6128 },
    featuredImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1000',
    trendingScore: 512.9
  },
  {
    title: 'Delhi Police Head Constable',
    organization: 'Delhi Police',
    state: 'Delhi',
    jobType: 'Police',
    qualification: '12th Pass',
    shortDescription: 'Delhi Police invites applications from Indian citizens for the recruitment of Head Constable (AWO/TPO) in Delhi Police.',
    status: 'published',
    isTrending: true,
    viewCount: 7600,
    importantDates: {
      applicationEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
    vacancy: { total: 857 },
    featuredImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000',
    trendingScore: 320.1
  }
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected for job seeding...');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs.');

    // Pre-calculate trending scores if not set
    const now = new Date();
    for (const data of sampleJobs) {
      if (!data.trendingScore) {
          // Manual mock score if needed
      }
      data.publishedAt = now;
    }

    const docs = await Job.create(sampleJobs);
    console.log(`Seeded ${docs.length} sample jobs successfully!`);
    
    process.exit(0);
  } catch (err) {
    console.error('Job Seed Failed:', err);
    process.exit(1);
  }
};

seedJobs();
