import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import getPrismaClient from '@/lib/db'
import { ensureUserExists } from '@/lib/user-creation'

// POST /api/resumes - Create a new resume for the authenticated user
export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const { userId, sessionClaims } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        userMessage: 'You must be logged in to create a resume.'
      }, { status: 401 });
    }
    
    // Get the prisma client
    const prismaClient = await getPrismaClient();
    
    // Ensure user exists in database before creating resume
    const email = (sessionClaims?.email as string) || `${userId}@example.com`;
    const fullName = (sessionClaims?.fullName as string) || 'User';
    const user = await ensureUserExists(prismaClient, userId, email, fullName);

    const body = await req.json();
    const { templateName, content, analysisData, score } = body;
    
    // Add a timeout to prevent hanging database operations
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database operation timeout - please try again')), 10000)
    );
    
    // Create a new resume with timeout
    const createPromise = prismaClient.resume.create({
      data: {
        userId,
        templateName: templateName || 'Default Resume',
        content: content ? JSON.parse(JSON.stringify(content)) : null,
        isActive: true
      }
    });
    
    const resume = await Promise.race([createPromise, timeoutPromise]) as any;
    
    return NextResponse.json({ resume, analysisData, score });
  } catch (error: any) {
    console.error('Error creating resume:', error);
    
    // Return a more user-friendly error message
    let userMessage = 'Failed to create resume. Please try again later.';
    
    if (error.message?.includes('timeout')) {
      userMessage = 'The database operation is taking longer than expected. Please try again in a few minutes.';
    } else if (error.message?.includes('Unauthorized')) {
      userMessage = 'You must be logged in to create a resume.';
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to create resume',
      userMessage: userMessage
    }, { status: 500 });
  }
}

// GET /api/resumes - Get all resumes for the authenticated user
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        userMessage: 'You must be logged in to view resumes.'
      }, { status: 401 });
    }
    
    // Get the prisma client
    const prismaClient = await getPrismaClient();
    
    // Add a timeout to prevent hanging database operations
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database operation timeout - please try again')), 10000)
    );
    
    // Get all resumes for the user with timeout
    const findPromise = prismaClient.resume.findMany({
      where: {
        userId: userId,
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    const resumes = await Promise.race([findPromise, timeoutPromise]) as any;
    
    return NextResponse.json({ resumes });
  } catch (error: any) {
    console.error('Error fetching resumes:', error);
    
    // Return a more user-friendly error message
    let userMessage = 'Failed to fetch resumes. Please try again later.';
    
    if (error.message?.includes('timeout')) {
      userMessage = 'The database operation is taking longer than expected. Please try again in a few minutes.';
    } else if (error.message?.includes('Unauthorized')) {
      userMessage = 'You must be logged in to view resumes.';
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch resumes',
      userMessage: userMessage
    }, { status: 500 });
  }
}