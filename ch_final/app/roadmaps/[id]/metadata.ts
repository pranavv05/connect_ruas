import type { Metadata } from "next";

export const roadmapDetailMetadata: Metadata = {
  title: 'Career Roadmap Detail - Baby Collab',
  description: 'View and manage your personalized career roadmap on Baby Collab. Track your progress, complete milestones, and achieve your career goals.',
  keywords: [
    'career roadmap',
    'career planning',
    'professional development',
    'skill tracking',
    'career goals',
    'Baby Collab'
  ],
  openGraph: {
    title: 'Career Roadmap Detail - Baby Collab',
    description: 'View and manage your personalized career roadmap on Baby Collab. Track your progress, complete milestones, and achieve your career goals.',
    url: 'https://babycollab.com/roadmaps/[id]',
    siteName: 'Baby Collab',
    images: [
      {
        url: 'https://babycollab.com/roadmap-detail-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Baby Collab Career Roadmap Detail'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Roadmap Detail - Baby Collab',
    description: 'View and manage your personalized career roadmap on Baby Collab.',
    images: ['https://babycollab.com/roadmap-detail-og-image.jpg'],
  },
};