import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import getPrismaClient from '@/lib/db'
import { ensureUserExists } from '@/lib/user-creation'

// GET /api/dashboard/resume - Get resume information for the authenticated user
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient()
    
    // Get user's active resume
    const resume = await prisma.resume.findFirst({
      where: {
        userId: userId,
        isActive: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    
    // Transform the data to match the frontend expectations
    const resumeData = {
      id: resume?.id || null,
      fileName: resume?.templateName || 'My_Resume.pdf',
      lastUpdated: resume?.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Never',
      suggestionsCount: Math.floor(Math.random() * 6) // Random number for demo purposes
    }
    
    return NextResponse.json(resumeData)
  } catch (error) {
    console.error('Error fetching dashboard resume:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard resume' }, { status: 500 })
  }
}

// POST /api/dashboard/resume - Create or update resume for the authenticated user
export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const { userId, sessionClaims } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient()
    
    // Ensure user exists in database before creating resume
    const email = (sessionClaims?.email as string) || `${userId}@example.com`
    const fullName = (sessionClaims?.fullName as string) || 'User'
    const user = await ensureUserExists(prisma, userId, email, fullName)
    
    const body = await req.json()
    const { templateName, content } = body
    
    // Create or update resume
    // First, try to find an existing active resume
    let resume = await prisma.resume.findFirst({
      where: {
        userId: userId,
        isActive: true
      }
    })
    
    if (resume) {
      // Update existing resume
      resume = await prisma.resume.update({
        where: {
          id: resume.id
        },
        data: {
          templateName: templateName || 'My_Resume.pdf',
          content: content || {},
          updatedAt: new Date()
        }
      })
    } else {
      // Create new resume
      resume = await prisma.resume.create({
        data: {
          userId: userId,
          templateName: templateName || 'My_Resume.pdf',
          content: content || {},
          isActive: true
        }
      })
    }
    
    return NextResponse.json({ 
      message: 'Resume updated successfully',
      resume: {
        id: resume.id,
        fileName: resume.templateName,
        lastUpdated: new Date(resume.updatedAt).toLocaleDateString()
      }
    })
  } catch (error) {
    console.error('Error updating dashboard resume:', error)
    return NextResponse.json({ error: 'Failed to update dashboard resume' }, { status: 500 })
  }
}