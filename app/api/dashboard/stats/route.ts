import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import getPrismaClient from '@/lib/db'

// Helper function to safely parse phases data
function parsePhasesData(phases: any): any[] {
  if (!phases) return []
  
  try {
    // If it's already an array, return it
    if (Array.isArray(phases)) {
      return phases
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof phases === 'string') {
      return JSON.parse(phases)
    }
    
    // If it's an object, convert it to an array
    if (typeof phases === 'object' && phases !== null) {
      // Check if it's already in the correct format
      if (phases.id && phases.title && phases.milestones) {
        return [phases]
      }
      
      // Convert object values to array
      return Object.values(phases).filter((value: any) => 
        typeof value === 'object' && value !== null && (value.id || value.title)
      ) as any[]
    }
  } catch (error) {
    console.error('Error parsing phases data:', error)
  }
  
  return []
}

// Helper function to count milestones
function countMilestones(phases: any[]): { total: number; completed: number } {
  let total = 0
  let completed = 0
  
  phases.forEach(phase => {
    if (phase && typeof phase === 'object' && Array.isArray(phase.milestones)) {
      total += phase.milestones.length
      completed += phase.milestones.filter((m: any) => 
        m && typeof m === 'object' && m.completed === true
      ).length
    }
  })
  
  return { total, completed }
}

// GET /api/dashboard/stats - Get dashboard statistics for the authenticated user
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the prisma client
    const prisma: any = await getPrismaClient()
    
    // Add caching headers for 5 minutes
    const cacheHeaders = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      'CDN-Cache-Control': 'public, s-maxage=300',
    }
    
    // Get user's roadmaps
    const roadmaps = await prisma.roadmap.findMany({
      where: {
        userId: userId
      },
      select: {
        id: true,
        title: true,
        phases: true,
        createdAt: true
      }
    })
    
    // Get projects where user is creator
    const createdProjects = await prisma.project.findMany({
      where: {
        creatorId: userId
      },
      select: {
        id: true,
        title: true,
        status: true
      }
    })
    
    // Get projects where user is member
    const projectMemberships = await prisma.projectMember.findMany({
      where: {
        userId: userId
      },
      select: {
        project: {
          select: {
            id: true,
            title: true,
            status: true
          }
        }
      }
    })
    
    console.log('Raw roadmaps data:', JSON.stringify(roadmaps, null, 2))
    console.log('Raw created projects data:', JSON.stringify(createdProjects, null, 2))
    console.log('Raw project memberships data:', JSON.stringify(projectMemberships, null, 2))
    
    // Calculate active roadmaps and completed milestones
    let activeRoadmaps = 0
    let completedMilestones = 0
    let totalMilestones = 0
    
    roadmaps.forEach((roadmap: any) => {
      // Parse phases data properly
      const phases = parsePhasesData(roadmap.phases)
      console.log(`Roadmap ${roadmap.id} phases:`, JSON.stringify(phases, null, 2))
      
      // Count total and completed milestones
      const { total, completed } = countMilestones(phases)
      
      // Add to totals
      totalMilestones += total
      completedMilestones += completed
      
      // Count as active if it has milestones
      if (total > 0) {
        activeRoadmaps++
      }
    })
    
    // Create a set to deduplicate projects (in case user is both creator and member)
    const projectSet = new Set()
    const allProjects: { id: string; title: string; status: string }[] = []
    
    // Add created projects
    createdProjects.forEach((project: any) => {
      if (!projectSet.has(project.id)) {
        projectSet.add(project.id)
        allProjects.push(project)
      }
    })
    
    // Add project memberships
    projectMemberships.forEach((pm: any) => {
      if (!projectSet.has(pm.project.id)) {
        projectSet.add(pm.project.id)
        allProjects.push(pm.project)
      }
    })
    
    const totalProjects = allProjects.length
    
    // Count project statuses correctly
    let projectsInProgress = 0
    let projectsCompleted = 0
    
    allProjects.forEach((project: any) => {
      const status = project.status ? project.status.toLowerCase() : ''
      
      // Count as completed only if explicitly marked as completed
      if (status === 'completed') {
        projectsCompleted++
      } 
      // Count as in progress if it's active or in_progress
      else if (status === 'active' || status === 'in_progress') {
        projectsInProgress++
      }
      // planning status is not counted as in progress
    })
    
    // Calculate skills learned (using completed milestones as a proxy)
    const skillsLearned = completedMilestones
    
    // Calculate career progress (0-100%)
    let careerProgress = 0
    if (totalMilestones > 0) {
      careerProgress = Math.round((completedMilestones / totalMilestones) * 100)
    }
    
    // Calculate progress this month (simplified)
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    
    const recentRoadmaps = roadmaps.filter((roadmap: any) => 
      roadmap.createdAt && new Date(roadmap.createdAt) >= oneMonthAgo
    )
    
    let recentCompletedMilestones = 0
    
    recentRoadmaps.forEach((roadmap: any) => {
      // Parse phases data properly
      const phases = parsePhasesData(roadmap.phases)
      
      // Count completed milestones in recent roadmaps
      const { completed } = countMilestones(phases)
      recentCompletedMilestones += completed
    })
    
    // Transform the data to match the frontend expectations
    const stats = {
      activeRoadmaps: activeRoadmaps,
      totalProjects: totalProjects,
      skillsLearned: skillsLearned,
      careerProgress: careerProgress,
      roadmapsInProgress: activeRoadmaps, // All roadmaps with milestones are considered active
      projectsCompleted: projectsCompleted,
      projectsInProgress: projectsInProgress,
      skillsThisMonth: recentCompletedMilestones,
      progressThisMonth: careerProgress > 0 ? Math.min(careerProgress, 100) : 0
    }
    
    console.log('Final stats:', JSON.stringify(stats, null, 2))
    
    return NextResponse.json(stats, { 
      status: 200,
      headers: cacheHeaders
    })
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats', details: error.message }, { status: 500 })
  }
}