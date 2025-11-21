import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import getPrismaClient from '@/lib/db';
import { ensureUserExists } from '@/lib/user-creation';

export async function PUT(req: Request) {
  try {
    // Get the authenticated user
    const { userId, sessionClaims } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prisma client
    const prismaClient = await getPrismaClient();

    // Get the request body
    const body = await req.json();
    
    // Extract avatar URL
    const { avatarUrl } = body;

    // Get email and full name from session claims
    const email = (sessionClaims?.email as string) || `${userId}@example.com`;
    const fullName = (sessionClaims?.fullName as string) || 'User';

    // Ensure user exists with proper data
    const user = await ensureUserExists(prismaClient, userId, email, fullName);

    // Update user's avatar URL
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating profile photo:', error);
    
    // Handle unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to update profile photo' }, { status: 500 });
  }
}