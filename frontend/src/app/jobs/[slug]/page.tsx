import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import JobDetailsContainer from '@/components/public/JobDetailsContainer';
import api from '@/lib/api';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const resp = await api.get('/jobs/slugs');
    if (resp.data.success && Array.isArray(resp.data.data)) {
       return resp.data.data.map((job: any) => ({
          slug: job.slug,
       }));
    }
    return [];
  } catch (err) {
    console.error('Error in generateStaticParams:', err);
    return [];
  }
}

const getJob = cache(async (slug: string) => {
  try {
    const resp = await api.get(`/jobs/${slug}`);
    return resp.data.data;
  } catch (err) {
    console.error('Error fetching job:', err);
    return null;
  }
});

// Revalidate every 10 minutes
export const revalidate = 600;

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    return {
      title: 'Job Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: job.seo?.metaTitle || job.title,
    description: job.seo?.metaDescription || job.shortDescription,
    keywords: job.seo?.keywords?.length ? job.seo.keywords : [job.organization, job.state, job.jobType, 'Sarkari Naukri'],
    alternates: {
      canonical: job.seo?.canonicalUrl || `/jobs/${job.slug}`,
    },
    openGraph: {
      title: job.seo?.metaTitle || job.title,
      description: job.seo?.metaDescription || job.shortDescription,
      url: `/jobs/${job.slug}`,
      siteName: 'SarkariSetu',
      images: job.seo?.ogImage ? [job.seo.ogImage, ...previousImages] : [job.featuredImage, ...previousImages],
      type: 'article',
      publishedTime: job.publishedAt || job.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: job.seo?.metaTitle || job.title,
      description: job.seo?.metaDescription || job.shortDescription,
      images: job.seo?.ogImage ? [job.seo.ogImage] : [job.featuredImage],
    },
  };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    notFound();
  }

  return (
    <>
      {/* JSON-LD Schema Markup */}
      {job.seo?.schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(job.seo.schemaMarkup) }}
        />
      )}
      
      <JobDetailsContainer job={job} />
    </>
  );
}
