// lib/sitemap-generator.ts
import { promises as fs } from 'fs'
import { join } from 'path'

// This function would fetch all roadmaps from the database in a real implementation
async function getAllRoadmaps() {
  // In a real implementation, you would fetch from your database
  // For now, we'll return an empty array
  return []
}

export async function generateSitemap() {
  const baseUrl = 'https://connectruas.com'
  
  // Get all roadmaps
  const roadmaps = await getAllRoadmaps()
  
  // Static pages
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

  // Generate sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page === '' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${page === '' ? '1.0' : page.startsWith('/docs') || page.startsWith('/help') ? '0.7' : '0.8'}</priority>
  </url>
  `).join('')}
  ${roadmaps.map((roadmap: any) => `
  <url>
    <loc>${baseUrl}/roadmaps/${roadmap.id}</loc>
    <lastmod>${new Date(roadmap.updatedAt || roadmap.createdAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  `).join('')}
</urlset>`

  return sitemap
}