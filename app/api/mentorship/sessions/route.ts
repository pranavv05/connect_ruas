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
    
    // Get sessions for mentorships where user is either mentor or mentee
    const sessions = await prisma.mentorshipSession.findMany({
      where: {
        mentorship: {
          OR: [
            { mentorId: userId },
            { menteeId: userId }
          ]
        }
      },
      include: {
        mentorship: {
          include: {
            mentor: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true
              }
            },
            mentee: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true
              }
            }
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching mentorship sessions:", error);
    return NextResponse.json({ error: "Failed to fetch mentorship sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = getAuth(req as any);
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { mentorshipId, scheduledAt, duration, topic } = await req.json();
    const prisma = await getPrismaClient();
    
    // Verify user is part of this mentorship
    const mentorship = await prisma.mentorship.findUnique({
      where: {
        id: mentorshipId
      }
    });

    if (!mentorship || (mentorship.mentorId !== userId && mentorship.menteeId !== userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create mentorship session
    const session = await prisma.mentorshipSession.create({
      data: {
        mentorshipId,
        scheduledAt: new Date(scheduledAt),
        duration,
        topic
      },
      include: {
        mentorship: {
          include: {
            mentor: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true
              }
            },
            mentee: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Error creating mentorship session:", error);
    return NextResponse.json({ error: "Failed to create mentorship session" }, { status: 500 });
  }
}