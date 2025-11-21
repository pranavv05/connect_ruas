import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import getPrismaClient from '@/lib/db'

// GET /api/dashboard/projects - Get projects for the dashboard
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
    
    // Get user's projects (both created and member of)
    const [createdProjects, projectMemberships] = await Promise.all([
      prisma.project.findMany({
        where: {
          creatorId: userId
        },
        include: {
          creator: true,
          files: true,
        },
        take: 3, // Limit to 3 for dashboard
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.projectMember.findMany({
        where: {
          userId: userId
        },
        include: {
          project: {
            include: {
              creator: true,
              files: true,
            }
          },
          user: true
        },
        take: 3, // Limit to 3 for dashboard
        orderBy: {
          joinedAt: 'desc'
        }
      })
    ])
    
    // Combine and deduplicate projects
    const allProjectsMap = new Map()
    
    // Add created projects
    createdProjects.forEach((project: any) => {
      allProjectsMap.set(project.id, project)
    })
    
    // Add project memberships
    projectMemberships.forEach((pm: any) => {
      allProjectsMap.set(pm.project.id, pm.project)
    })
    
    // Convert map back to array
    const allProjects = Array.from(allProjectsMap.values())
    
    // Transform the data to match the frontend expectations
    const transformedProjects = allProjects.map((project: any) => ({
      id: project.id,
      title: project.title,
      description: project.description || '',
      status: project.status,
      dueDate: project.dueDate ? project.dueDate.toISOString() : undefined,
      createdAt: project.createdAt.toISOString(),
      teamSize: project.currentTeamSize,
      openPositions: Math.max(0, (project.maxTeamSize || 0) - project.currentTeamSize),
      files: project.files.map((file: any) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.url,
      })) || [],
    }))
    
    return NextResponse.json(transformedProjects, { 
      status: 200,
      headers: cacheHeaders
    })
  } catch (error) {
    console.error('Error fetching dashboard projects:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard projects' }, { status: 500 })
  }
}