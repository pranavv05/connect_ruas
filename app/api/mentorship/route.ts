import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getPrismaClient } from '@/lib/db'

export async function GET(req: Request) {
  const { userId } = getAuth(req as any);
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prisma = await getPrismaClient();
    
    // Get mentorships where user is either mentor or mentee
    const mentorships = await prisma.mentorship.findMany({
      where: {
        OR: [
          { mentorId: userId },
          { menteeId: userId }
        ]
      },
      include: {
        mentor: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            role: true
          }
        },
        mentee: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            role: true
          }
        },
        sessions: {
          orderBy: {
            scheduledAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(mentorships);
  } catch (error) {
    console.error("Error fetching mentorships:", error);
    return NextResponse.json({ error: "Failed to fetch mentorships" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = getAuth(req as any);
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { mentorId, message } = await req.json();
    const prisma = await getPrismaClient();
    
    // Check if mentorship request already exists
    const existingMentorship = await prisma.mentorship.findUnique({
      where: {
        mentorId_menteeId: {
          mentorId,
          menteeId: userId
        }
      }
    });

    if (existingMentorship) {
      return NextResponse.json({ error: "Mentorship request already exists" }, { status: 400 });
    }

    // Create mentorship request
    const mentorship = await prisma.mentorship.create({
      data: {
        mentorId,
        menteeId: userId,
        status: "pending"
      },
      include: {
        mentor: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            role: true
          }
        },
        mentee: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json(mentorship, { status: 201 });
  } catch (error) {
    console.error("Error creating mentorship request:", error);
    return NextResponse.json({ error: "Failed to create mentorship request" }, { status: 500 });
  }
}