import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getPrismaClient } from '@/lib/db'

// GET /api/mentorship/search - Search for mentors
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient()
    
    // Get query parameters
    const url = new URL(req.url)
    const query = url.searchParams.get('q') || ''
    const expertise = url.searchParams.get('expertise') || ''
    
    // Build the SQL query
    let sqlQuery = `
      SELECT 
        u.id,
        u.full_name as name,
        p.current_status as role,
        'Company' as company,
        SUBSTR(u.full_name, 1, 2) as avatar,
        4.5 as rating,
        0 as sessions,
        'Experienced professional' as about
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id != '${userId}'
    `
    
    // Add search conditions if query is provided
    if (query) {
      sqlQuery += ` AND (u.full_name LIKE '%${query}%' OR p.current_status LIKE '%${query}%')`
    }
    
    // Execute the query
    const mentors: any[] = await prisma.$queryRawUnsafe(sqlQuery)
    
    return NextResponse.json(mentors, { status: 200 })
  } catch (error: any) {
    console.error('Error searching mentors:', error)
    return NextResponse.json({ error: 'Failed to search mentors', details: error.message }, { status: 500 })
  }
}