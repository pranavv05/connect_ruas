import { NextResponse } from 'next/server';
import getPrismaClient from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

// GET /api/projects/[id]/join-requests - Get all join requests for a project
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    // Check if the current user is the project creator/admin
    const project = await prisma.project.findUnique({
      where: { id: id },
    });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Only project creator/admin can view join requests
    if (project.creatorId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const joinRequests = await prisma.projectJoinRequest.findMany({
      where: {
        projectId: id,
        status: 'pending'
      },
      include: {
        user: true
      }
    });
    
    // Transform the data to match the frontend expectations
    const transformedRequests = joinRequests.map((request: any) => ({
      id: request.id,
      userId: request.userId,
      userName: request.user?.fullName || 'Unknown User',
      userAvatar: request.user?.fullName ? request.user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'UU',
      message: request.message || '',
      createdAt: request.createdAt.toISOString(),
    }));
    
    return NextResponse.json(transformedRequests);
  } catch (error) {
    console.error('Error fetching join requests:', error);
    return NextResponse.json({ error: 'Failed to fetch join requests' }, { status: 500 });
  }
}