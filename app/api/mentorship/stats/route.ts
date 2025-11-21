import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getPrismaClient } from '@/lib/db'

// GET /api/mentorship/stats - Get mentorship statistics for the authenticated user
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient()
    
    // Get mentorship stats for the user using raw SQL
    const activeMentorshipsAsMentorResult: any[] = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM mentorships 
      WHERE mentor_id = ${userId} AND status = 'accepted'
    `
    const activeMentorshipsAsMentor = Number(activeMentorshipsAsMentorResult[0].count)
    
    const activeMentorshipsAsMenteeResult: any[] = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM mentorships 
      WHERE mentee_id = ${userId} AND status = 'accepted'
    `
    const activeMentorshipsAsMentee = Number(activeMentorshipsAsMenteeResult[0].count)
    
    const totalActiveMentorships = activeMentorshipsAsMentor + activeMentorshipsAsMentee
    
    // Get upcoming sessions
    const upcomingSessionsResult: any[] = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM mentorship_sessions ms
      JOIN mentorships m ON ms.mentorship_id = m.id
      WHERE (m.mentor_id = ${userId} OR m.mentee_id = ${userId})
      AND ms.scheduled_at >= ${new Date()}
      AND ms.status = 'scheduled'
    `
    const upcomingSessions = Number(upcomingSessionsResult[0].count)
    
    // Calculate total hours (simplified)
    const totalHoursResult: any[] = await prisma.$queryRaw`
      SELECT SUM(duration) as total FROM mentorship_sessions ms
      JOIN mentorships m ON ms.mentorship_id = m.id
      WHERE (m.mentor_id = ${userId} OR m.mentee_id = ${userId})
      AND ms.status = 'completed'
    `
    const totalHours = Number(totalHoursResult[0].total) || 0
    
    // Get skills gained (simplified - using completed sessions as proxy)
    const skillsGainedResult: any[] = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM mentorship_sessions ms
      JOIN mentorships m ON ms.mentorship_id = m.id
      WHERE (m.mentor_id = ${userId} OR m.mentee_id = ${userId})
      AND ms.status = 'completed'
    `
    const skillsGained = Number(skillsGainedResult[0].count)
    
    // Transform the data to match the frontend expectations
    const stats = {
      activeMentors: activeMentorshipsAsMentee, // If user is mentee, these are their mentors
      upcomingSessions: upcomingSessions,
      totalHours: totalHours,
      skillsGained: skillsGained
    }
    
    return NextResponse.json(stats, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching mentorship stats:', error)
    return NextResponse.json({ error: 'Failed to fetch mentorship stats', details: error.message }, { status: 500 })
  }
}