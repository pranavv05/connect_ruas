import { NextResponse } from "next/server";
import getPrismaClient from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { ensureUserExists } from '@/lib/user-creation';

// POST /api/projects/[id]/join - Request to join a project
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    console.log(`Join request for project ${id} from user ${userId}`);
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: id },
    });
    
    if (!project) {
      console.log(`Project ${id} not found`);
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    console.log(`Project found: ${project.title}`);
    
    // Check if user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId,
        }
      }
    });
    
    if (existingMember) {
      console.log(`User ${userId} is already a member of project ${id}`);
      return NextResponse.json({ error: "You are already a member of this project" }, { status: 400 });
    }
    
    // Check if user already has a pending request
    const existingRequest = await prisma.projectJoinRequest.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId,
        }
      }
    });
    
    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        console.log(`User ${userId} already has a pending request for project ${id}`);
        return NextResponse.json({ error: "You have already submitted a join request for this project" }, { status: 400 });
      } else if (existingRequest.status === 'accepted') {
        console.log(`User ${userId} was already accepted for project ${id}`);
        return NextResponse.json({ error: "You have already been accepted to this project" }, { status: 400 });
      }
    }
    
    // Get user info from Clerk to ensure we have the latest name and email
    const { sessionClaims } = getAuth(req as any);
    const fullName = (sessionClaims?.fullName as string) || 'User';
    const email = (sessionClaims?.email as string) || `${userId}@example.com`; // Get actual email from Clerk
    
    // Ensure user exists with proper data
    const user = await ensureUserExists(prisma, userId, email, fullName);
    
    // Create or update the join request
    const joinRequest = await prisma.projectJoinRequest.upsert({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId,
        }
      },
      update: {
        status: 'pending',
        updatedAt: new Date(),
      },
      create: {
        projectId: id,
        userId: userId,
        status: 'pending',
      },
    });
    
    console.log(`Join request created/updated: ${joinRequest.id}`);
    
    return NextResponse.json({ 
      message: "Join request submitted successfully", 
      requestId: joinRequest.id 
    }, { status: 200 });
  } catch (err) {
    console.error('Error submitting join request:', err);
    return NextResponse.json({ error: 'Failed to submit join request: ' + (err as Error).message }, { status: 500 });
  }
}