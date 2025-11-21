import type { Metadata } from "next";

export const roadmapDetailMetadata: Metadata = {
  title: 'Career Roadmap Detail - ConnectRUAS',
  description: 'View and manage your personalized career roadmap on ConnectRUAS. Track your progress, complete milestones, and achieve your career goals.',
  keywords: [
    'career roadmap',
    'career planning',
    'professional development',
    'skill tracking',
    'career goals',
    'ConnectRUAS'
  ],
  openGraph: {
    title: 'Career Roadmap Detail - ConnectRUAS',
    description: 'View and manage your personalized career roadmap on ConnectRUAS. Track your progress, complete milestones, and achieve your career goals.',
    url: 'https://connectruas.com/roadmaps/[id]',
    siteName: 'ConnectRUAS',
    images: [
      {
        url: 'https://connectruas.com/roadmap-detail-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ConnectRUAS Career Roadmap Detail'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Roadmap Detail - ConnectRUAS',
    description: 'View and manage your personalized career roadmap on ConnectRUAS.',
    images: ['https://connectruas.com/roadmap-detail-og-image.jpg'],
  },
};