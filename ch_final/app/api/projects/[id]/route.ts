import { NextResponse } from "next/server";
import getPrismaClient from '@/lib/db';
import { getUserDisplayInfo } from '@/lib/user-utils';
import { getAuth } from '@clerk/nextjs/server';

// GET /api/projects/[id] - Get a specific project
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    // Fetch project with related data
    const project = await prisma.project.findUnique({
      where: { id: id }
    });
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    // Fetch related data separately
    const [members, creator, files, techStack, joinRequests] = await Promise.all([
      prisma.projectMember.findMany({
        where: { projectId: id },
        include: { user: true }
      }),
      prisma.user.findUnique({
        where: { id: project.creatorId }
      }),
      prisma.projectFile.findMany({
        where: { projectId: id }
      }),
      // Use raw query for tech stack since there seems to be an issue with the Prisma client
      prisma.$queryRaw`SELECT * FROM project_tech WHERE project_id = ${id}`,
      prisma.projectJoinRequest.findMany({
        where: {
          projectId: id,
          status: 'pending'
        },
        include: {
          user: true
        }
      })
    ]);
    
    // Extract skills from techStack
    const skills = (techStack as any[]).map((tech: any) => tech.technology);
    
    // Transform join requests
    const transformedRequests = joinRequests.map((request: any) => {
      const userInfo = getUserDisplayInfo(request.user);
      return {
        id: request.id,
        userId: request.userId,
        name: userInfo.name,
        avatar: userInfo.avatarUrl || userInfo.initials,
        avatarUrl: userInfo.avatarUrl, // Include avatar URL directly
        message: request.message || '',
        createdAt: request.createdAt.toISOString(),
      }
    });
    
    // Transform the data to match the frontend expectations
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description || '',
      fullDescription: project.fullDescription || project.description || '',
      status: project.status,
      dueDate: project.dueDate ? project.dueDate.toISOString() : undefined,
      adminId: project.creatorId,
      admin: {
        id: project.creatorId,
        name: creator?.fullName || 'Unknown User',
        avatar: creator?.avatarUrl || getInitials(creator?.fullName || 'Unknown User'),
      },
      skills: skills,
      members: members.map((member: any) => {
        const memberInfo = getUserDisplayInfo(member.user);
        return {
          id: member.userId,
          name: memberInfo.name,
          avatar: memberInfo.avatarUrl || memberInfo.initials,
          role: member.role || 'member',
        }
      }),
      pendingRequests: transformedRequests,
      files: files.map((file: any) => ({
        id: file.id,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type,
        uploadedBy: creator?.fullName || 'Unknown',
        // Use current time as fallback since ProjectFile doesn't have createdAt field
        uploadedAt: new Date().toISOString(),
        url: file.url,
      })),
    };
    
    return NextResponse.json(transformedProject);
  } catch (err) {
    console.error('Error fetching project:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
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
    
    // Check if the user is the project admin
    if (project.creatorId !== userId) {
      return NextResponse.json({ error: "Only project admins can edit project details" }, { status: 403 });
    }
    
    const body = await req.json();
    
    // Check what type of update we're doing
    if (body.status !== undefined) {
      // Update the project status
      const updatedProject = await prisma.project.update({
        where: { id: id },
        data: {
          status: body.status,
        },
      });
      
      return NextResponse.json({ 
        message: "Project status updated successfully",
        project: updatedProject 
      });
    } else {
      // Update project details (title, description, dueDate)
      const updatedProject = await prisma.project.update({
        where: { id: id },
        data: {
          title: body.title,
          description: body.description,
          fullDescription: body.description,
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
        },
      });
      
      return NextResponse.json({
        id: updatedProject.id,
        title: updatedProject.title,
        description: updatedProject.description,
        dueDate: updatedProject.dueDate ? updatedProject.dueDate.toISOString() : null,
      });
    }
  } catch (err) {
    console.error('Error updating project:', err);
    // Check if it's a Prisma record not found error
    if (err instanceof Error && err.message.includes('RecordNotFound')) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
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
    
    // Check if the user is the project admin
    if (project.creatorId !== userId) {
      return NextResponse.json({ error: "Only project admins can delete projects" }, { status: 403 });
    }
    
    // Delete related records first to avoid foreign key constraint violations
    // Delete project tech stack
    await prisma.projectTech.deleteMany({
      where: { projectId: id },
    });
    
    // Delete project files
    await prisma.projectFile.deleteMany({
      where: { projectId: id },
    });
    
    // Delete project join requests
    await prisma.projectJoinRequest.deleteMany({
      where: { projectId: id },
    });
    
    // Delete project members
    await prisma.projectMember.deleteMany({
      where: { projectId: id },
    });
    
    // Delete project messages
    await prisma.projectMessage.deleteMany({
      where: { projectId: id },
    });
    
    // Delete project tasks
    await prisma.task.deleteMany({
      where: { projectId: id },
    });
    
    // Now delete the project itself
    await prisma.project.delete({
      where: { id: id },
    });
    
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error('Error deleting project:', err);
    // Check if it's a Prisma record not found error
    if (err instanceof Error && err.message.includes('RecordNotFound')) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// Helper function
function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}