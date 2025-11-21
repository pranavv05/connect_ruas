import type { Metadata } from "next";

export const roadmapsMetadata: Metadata = {
  title: 'Career Roadmaps - Baby Collab',
  description: 'Create and manage your personalized career roadmaps with Baby Collab. Plan your career path with AI-powered milestones, skills, and goals.',
  keywords: [
    'career roadmaps',
    'career planning',
    'AI career path',
    'professional development',
    'skill tracking',
    'career goals',
    'Baby Collab'
  ],
  openGraph: {
    title: 'Career Roadmaps - Baby Collab',
    description: 'Create and manage your personalized career roadmaps with Baby Collab. Plan your career path with AI-powered milestones, skills, and goals.',
    url: 'https://babycollab.com/roadmaps',
    siteName: 'Baby Collab',
    images: [
      {
        url: 'https://babycollab.com/roadmaps-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Baby Collab Career Roadmaps'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Roadmaps - Baby Collab',
    description: 'Create and manage your personalized career roadmaps with Baby Collab.',
    images: ['https://babycollab.com/roadmaps-og-image.jpg'],
  },
};