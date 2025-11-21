import { NextResponse } from "next/server";
import getPrismaClient from '@/lib/db';
import { getAuth } from "@clerk/nextjs/server";

// GET /api/projects/[id]/files - Get all files for a project
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
    
    // First check if the project exists
    const project = await prisma.project.findUnique({
      where: { id: id },
    });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Check if user is a member of the project
    const projectMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId,
        },
      },
    });
    
    if (!projectMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Fetch files for the project
    const files = await prisma.projectFile.findMany({
      where: { projectId: id },
      include: { project: { include: { creator: true } } },
    });
    
    // Transform files to match frontend expectations
    const transformedFiles = files.map((file) => ({
      id: file.id,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type,
      uploadedBy: file.project?.creator?.fullName || 'Unknown User',
      // Use current time as fallback since ProjectFile doesn't have createdAt field
      uploadedAt: new Date().toISOString(),
      url: file.url,
    }));
    
    return NextResponse.json(transformedFiles);
  } catch (err) {
    console.error('Error fetching project files:', err);
    // Check if it's a Prisma record not found error
    if (err instanceof Error && err.message.includes('RecordNotFound')) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/projects/[id]/files - Upload a new file
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, url, size, type } = body;
    
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    // First check if the project exists
    const project = await prisma.project.findUnique({
      where: { id: id },
    });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Check if user is a member of the project
    const projectMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId,
        },
      },
    });
    
    if (!projectMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Create the file
    const newFile = await prisma.projectFile.create({
      data: {
        projectId: id,
        name: name,
        url: url,
        size: size,
        type: type,
      },
      include: { project: { include: { creator: true } } },
    });
    
    // Transform file to match frontend expectations
    const transformedFile = {
      id: newFile.id,
      name: newFile.name,
      size: `${(newFile.size / 1024 / 1024).toFixed(2)} MB`,
      type: newFile.type,
      uploadedBy: newFile.project?.creator?.fullName || 'Unknown User',
      // Use current time since ProjectFile doesn't have createdAt field
      uploadedAt: new Date().toISOString(),
      url: newFile.url,
    };
    
    return NextResponse.json(transformedFile);
  } catch (err) {
    console.error('Error uploading project file:', err);
    // Check if it's a Prisma record not found error
    if (err instanceof Error && err.message.includes('RecordNotFound')) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}