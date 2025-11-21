import { NextResponse } from "next/server";
import getPrismaClient from '@/lib/db';
import { getAuth } from "@clerk/nextjs/server";

// DELETE /api/projects/[id]/files/[fileId] - Delete a file
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  try {
    // Properly await the params promise
    const { id, fileId } = await params;
    
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
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
    
    // Delete the file
    await prisma.projectFile.delete({
      where: { id: fileId },
    });
    
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('Error deleting project file:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}