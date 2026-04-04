import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eligibility Checker',
  description: 'Instantly check your eligibility for thousands of government jobs. Filter by age, qualification, and state to find your perfect match on SarkariSetu.',
  keywords: ['Govt Job Eligibility', 'Age Limit Checker', 'Qualification Based Jobs', 'Sarkari Job Finder', 'India Government Vacancy Eligibility'],
  openGraph: {
    title: 'Check Your Govt Job Eligibility | SarkariSetu',
    description: 'Find government jobs you are eligible for in seconds.',
    type: 'website',
  }
};

export default function EligibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
