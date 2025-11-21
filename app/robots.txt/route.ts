import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://connectruas.com/sitemap.xml

Host: connectruas.com`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}