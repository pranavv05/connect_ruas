import type { Metadata } from "next";

export const roadmapsMetadata: Metadata = {
  title: 'Career Roadmaps - ConnectRUAS',
  description: 'Create and manage your personalized career roadmaps with ConnectRUAS. Plan your career path with AI-powered milestones, skills, and goals.',
  keywords: [
    'career roadmaps',
    'career planning',
    'AI career path',
    'professional development',
    'skill tracking',
    'career goals',
    'ConnectRUAS'
  ],
  openGraph: {
    title: 'Career Roadmaps - ConnectRUAS',
    description: 'Create and manage your personalized career roadmaps with ConnectRUAS. Plan your career path with AI-powered milestones, skills, and goals.',
    url: 'https://connectruas.com/roadmaps',
    siteName: 'ConnectRUAS',
    images: [
      {
        url: 'https://connectruas.com/roadmaps-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ConnectRUAS Career Roadmaps'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Roadmaps - ConnectRUAS',
    description: 'Create and manage your personalized career roadmaps with ConnectRUAS.',
    images: ['https://connectruas.com/roadmaps-og-image.jpg'],
  },
};