import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getPrismaClient } from '@/lib/db'

// GET /api/mentorship/mentors - Get user's mentors and mentees
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient()
    
    // Get mentorships where user is the mentee (these are their mentors) using raw SQL
    const mentorshipsAsMentee: any[] = await prisma.$queryRaw`
      SELECT 
        m.id as mentor_id,
        m.full_name as mentor_name,
        m.email as mentor_email,
        p.current_status as mentor_status
      FROM mentorships ms
      JOIN users m ON ms.mentor_id = m.id
      LEFT JOIN profiles p ON m.id = p.user_id
      WHERE ms.mentee_id = ${userId} AND ms.status = 'accepted'
    `
    
    // Get mentorships where user is the mentor (these are their mentees) using raw SQL
    const mentorshipsAsMentor: any[] = await prisma.$queryRaw`
      SELECT 
        m.id as mentee_id,
        m.full_name as mentee_name,
        m.email as mentee_email,
        p.current_status as mentee_status
      FROM mentorships ms
      JOIN users m ON ms.mentee_id = m.id
      LEFT JOIN profiles p ON m.id = p.user_id
      WHERE ms.mentor_id = ${userId} AND ms.status = 'accepted'
    `
    
    // Transform mentors data
    const mentors = mentorshipsAsMentee.map((mentorship: any) => ({
      id: mentorship.mentor_id,
      name: mentorship.mentor_name || 'Unknown Mentor',
      role: mentorship.mentor_status || 'Mentor',
      company: 'Company', // This would come from profile data
      avatar: mentorship.mentor_name ? mentorship.mentor_name.charAt(0) : 'M',
      expertise: [], // Would come from skills data
      rating: 4.5, // Default rating
      sessions: 0, // Would be calculated from sessions
      availability: 'Available' // Default availability
    }))
    
    // Transform mentees data
    const mentees = mentorshipsAsMentor.map((mentorship: any) => ({
      id: mentorship.mentee_id,
      name: mentorship.mentee_name || 'Unknown Mentee',
      role: mentorship.mentee_status || 'Mentee',
      company: 'Company', // This would come from profile data
      avatar: mentorship.mentee_name ? mentorship.mentee_name.charAt(0) : 'M',
      expertise: [], // Would come from skills data
      rating: 4.5, // Default rating
      sessions: 0, // Would be calculated from sessions
      availability: 'Available' // Default availability
    }))
    
    // Transform the data to match the frontend expectations
    const data = {
      mentors: mentors,
      mentees: mentees
    }
    
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching mentorship data:', error)
    return NextResponse.json({ error: 'Failed to fetch mentorship data', details: error.message }, { status: 500 })
  }
}