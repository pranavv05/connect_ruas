// components/structured-data.tsx
"use client"

import Script from 'next/script'

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ConnectRUAS",
    "url": "https://connectruas.com",
    "description": "The ultimate career development platform for college students and early professionals. Create AI-powered career roadmaps, collaborate on projects, and accelerate your career growth.",
    "applicationCategory": "Career Development Platform",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "College students and early professionals"
    }
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}