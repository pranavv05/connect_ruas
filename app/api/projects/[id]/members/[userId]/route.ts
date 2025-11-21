import { NextResponse } from "next/server";
import getPrismaClient from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

// DELETE /api/projects/[id]/members/[userId] - Remove a user from a project
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; userId: string }> }) {
  try {
    const { id, userId: userIdToRemove } = await params;
    
    // Get the authenticated user
    const { userId: authenticatedUserId } = getAuth(req as any);
    
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    // First check if the project exists
    const project = await prisma.project.findUnique({
      where: { id: id },
    });
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    // Check if the authenticated user is the project admin
    if (project.creatorId !== authenticatedUserId) {
      return NextResponse.json({ error: "Only project admins can remove members" }, { status: 403 });
    }
    
    // Check if the user to be removed is the project creator (admin)
    if (userIdToRemove === project.creatorId) {
      return NextResponse.json({ error: "Cannot remove the project creator" }, { status: 400 });
    }
    
    // Check if the user is actually a member of the project
    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userIdToRemove,
        },
      },
    });
    
    if (!membership) {
      return NextResponse.json({ error: "User is not a member of this project" }, { status: 400 });
    }
    
    // Remove the user from the project
    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userIdToRemove,
        },
      },
    });
    
    // Update the current team size
    await prisma.project.update({
      where: { id: id },
      data: {
        currentTeamSize: {
          decrement: 1,
        },
      },
    });
    
    return NextResponse.json({ message: "User removed from project successfully" });
  } catch (err) {
    console.error('Error removing user from project:', err);
    // Check if it's a Prisma record not found error
    if (err instanceof Error && err.message.includes('RecordNotFound')) {
      return NextResponse.json({ error: "Project or user not found" }, { status: 404 });
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}