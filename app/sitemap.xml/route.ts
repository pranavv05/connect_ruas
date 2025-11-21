import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const baseUrl = 'https://babycollab.com'
  
  // In a real application, you would fetch dynamic content URLs here
  // For now, we'll return the static sitemap content
  const staticPages = [
    '',
    '/sign-up',
    '/sign-in',
    '/docs/introduction',
    '/docs/getting-started',
    '/docs/roadmaps',
    '/docs/projects',
    '/docs/resume-builder',
    '/help',
    '/documentation',
    '/privacy',
    '/terms',
    '/cookies'
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>2025-10-21</lastmod>
    <changefreq>${page === '' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${page === '' ? '1.0' : page.startsWith('/docs') || page.startsWith('/help') ? '0.7' : '0.8'}</priority>
  </url>
  `).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}