import { NextResponse } from "next/server";
import getPrismaClient from '@/lib/db';
import { getAuth } from "@clerk/nextjs/server";
import { getUserDisplayInfo } from "@/lib/user-utils";

// GET /api/projects/[id]/messages - Get all messages for a project
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
    
    // Fetch messages for the project
    const messages = await prisma.projectMessage.findMany({
      where: { projectId: id },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
    
    // Transform messages to match frontend expectations
    const transformedMessages = messages.map((msg) => {
      const userInfo = getUserDisplayInfo(msg.user);
      return {
        id: msg.id,
        userId: msg.userId,
        userName: userInfo.name,
        userAvatar: userInfo.avatarUrl || userInfo.initials,
        message: msg.message,
        timestamp: msg.createdAt.toISOString(),
        type: msg.type,
        fileName: msg.fileName,
        fileSize: msg.fileSize,
      };
    });
    
    return NextResponse.json(transformedMessages);
  } catch (err) {
    console.error('Error fetching project messages:', err);
    // Check if it's a Prisma record not found error
    if (err instanceof Error && err.message.includes('RecordNotFound')) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/projects/[id]/messages - Create a new message
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { message, type, fileName, fileSize } = body;
    
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
    
    // Create the message
    const newMessage = await prisma.projectMessage.create({
      data: {
        projectId: id,
        userId: userId,
        message: message,
        type: type || 'text',
        fileName: fileName || null,
        fileSize: fileSize || null,
      },
      include: { user: true },
    });
    
    // Transform message to match frontend expectations
    const userInfo = getUserDisplayInfo(newMessage.user);
    const transformedMessage = {
      id: newMessage.id,
      userId: newMessage.userId,
      userName: userInfo.name,
      userAvatar: userInfo.avatarUrl || userInfo.initials,
      message: newMessage.message,
      timestamp: newMessage.createdAt.toISOString(),
      type: newMessage.type,
      fileName: newMessage.fileName,
      fileSize: newMessage.fileSize,
    };
    
    return NextResponse.json(transformedMessage);
  } catch (err) {
    console.error('Error creating project message:', err);
    // Check if it's a Prisma record not found error
    if (err instanceof Error && err.message.includes('RecordNotFound')) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}