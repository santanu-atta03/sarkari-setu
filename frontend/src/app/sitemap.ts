import { MetadataRoute } from 'next';
import api from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sarkarisetu.com';

  // Base routes
  const routes = ['', '/jobs', '/about', '/contact'].map((route) => ({
    url: `${baseURL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch all jobs to include in sitemap
  let jobRoutes: any[] = [];
  try {
    const resp = await api.get('/jobs?limit=1000');
    const jobs = resp.data.data;
    jobRoutes = jobs.map((job: any) => ({
      url: `${baseURL}/jobs/${job.slug}`,
      lastModified: new Date(job.updatedAt || job.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error('Error fetching jobs for sitemap:', err);
  }

  return [...routes, ...jobRoutes];
}
