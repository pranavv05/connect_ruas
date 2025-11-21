import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import getPrismaClient from '@/lib/db'

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
      // Handle phases data - it might be a string or object
      let phases: any[] = []
      
      if (roadmap.phases) {
        if (typeof roadmap.phases === 'string') {
          try {
            phases = JSON.parse(roadmap.phases)
          } catch (e) {
            console.error('Error parsing phases string:', e)
            phases = []
          }
        } else if (Array.isArray(roadmap.phases)) {
          phases = roadmap.phases
        } else if (typeof roadmap.phases === 'object') {
          // Handle Prisma JSON objects
          try {
            phases = Object.values(roadmap.phases).filter((value: any) => 
              typeof value === 'object' && value !== null
            ) as any[]
          } catch (e) {
            console.error('Error converting phases object to array:', e)
            phases = []
          }
        }
      }
      
      console.log(`Roadmap ${roadmap.id} phases:`, JSON.stringify(phases, null, 2))
      
      // Count total and completed milestones
      let roadmapTotalMilestones = 0
      let roadmapCompletedMilestones = 0
      
      phases.forEach((phase: any) => {
        if (phase && typeof phase === 'object' && Array.isArray(phase.milestones)) {
          roadmapTotalMilestones += phase.milestones.length
          roadmapCompletedMilestones += phase.milestones.filter((m: any) => 
            m && typeof m === 'object' && m.completed === true
          ).length
        }
      })
      
      // Add to totals
      totalMilestones += roadmapTotalMilestones
      completedMilestones += roadmapCompletedMilestones
      
      // Only count as active if not fully completed
      if (roadmapTotalMilestones > 0 && roadmapCompletedMilestones < roadmapTotalMilestones) {
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
    
    // Count project statuses
    let projectsInProgress = 0
    let projectsCompleted = 0
    
    allProjects.forEach((project: any) => {
      if (project.status && project.status.toLowerCase() === 'completed') {
        projectsCompleted++
      } else if (project.status && project.status.toLowerCase() !== 'planning') {
        projectsInProgress++
      }
    })
    
    // Calculate skills learned from completed milestones
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
    let recentTotalMilestones = 0
    
    recentRoadmaps.forEach((roadmap: any) => {
      // Handle phases data - it might be a string or object
      let phases: any[] = []
      
      if (roadmap.phases) {
        if (typeof roadmap.phases === 'string') {
          try {
            phases = JSON.parse(roadmap.phases)
          } catch (e) {
            console.error('Error parsing phases string:', e)
            phases = []
          }
        } else if (Array.isArray(roadmap.phases)) {
          phases = roadmap.phases
        } else if (typeof roadmap.phases === 'object') {
          // Handle Prisma JSON objects
          try {
            phases = Object.values(roadmap.phases).filter((value: any) => 
              typeof value === 'object' && value !== null
            ) as any[]
          } catch (e) {
            console.error('Error converting phases object to array:', e)
            phases = []
          }
        }
      }
      
      phases.forEach((phase: any) => {
        if (phase && typeof phase === 'object' && Array.isArray(phase.milestones)) {
          recentTotalMilestones += phase.milestones.length
          recentCompletedMilestones += phase.milestones.filter((m: any) => 
            m && typeof m === 'object' && m.completed === true
          ).length
        }
      })
    })
    
    const progressThisMonth = recentTotalMilestones > 0 
      ? Math.round((recentCompletedMilestones / recentTotalMilestones) * 100)
      : 0
    
    // Transform the data to match the frontend expectations
    const stats = {
      activeRoadmaps: activeRoadmaps,
      totalProjects: totalProjects,
      skillsLearned: skillsLearned,
      careerProgress: careerProgress,
      roadmapsInProgress: projectsInProgress,
      projectsCompleted: projectsCompleted,
      skillsThisMonth: recentCompletedMilestones,
      progressThisMonth: progressThisMonth
    }
    
    console.log('Final stats:', JSON.stringify(stats, null, 2))
    
    return NextResponse.json(stats, { 
      status: 200,
      headers: cacheHeaders
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats', details: error.message }, { status: 500 })
  }
}