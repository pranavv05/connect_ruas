import { NextResponse } from 'next/server';
import getPrismaClient from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

// GET /api/join-requests - Get all join requests for projects where the current user is admin
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    // Find all projects where the user is the creator/admin
    const projects = await prisma.project.findMany({
      where: {
        creatorId: userId,
      },
      include: {
        joinRequests: {
          where: {
            status: 'pending',
          },
          include: {
            user: true,
          },
        },
      },
    });
    
    // Flatten all join requests from all projects
    const allJoinRequests: any[] = [];
    projects.forEach(project => {
      project.joinRequests.forEach(request => {
        allJoinRequests.push({
          id: request.id,
          projectId: project.id,
          projectName: project.title,
          userId: request.userId,
          userName: request.user?.fullName || 'Unknown User',
          userAvatar: request.user?.fullName 
            ? request.user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) 
            : 'UU',
          message: request.message || '',
          createdAt: request.createdAt.toISOString(),
        });
      });
    });
    
    return NextResponse.json(allJoinRequests);
  } catch (error) {
    console.error('Error fetching join requests:', error);
    return NextResponse.json({ error: 'Failed to fetch join requests' }, { status: 500 });
  }
}