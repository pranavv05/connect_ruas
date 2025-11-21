import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import getPrismaClient from '@/lib/db';

// POST /api/user-type - Save user type and verification data
export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prisma client
    const prisma = await getPrismaClient();

    // Get the request body
    const body = await req.json();
    
    const { 
      userType, 
      graduationYear, 
      majorSubject, 
      collegeEmail 
    } = body;

    // Validate required fields based on user type
    if (!userType) {
      return NextResponse.json({ error: 'User type is required' }, { status: 400 });
    }

    if (userType === 'alumni' && (!graduationYear || !majorSubject)) {
      return NextResponse.json({ error: 'Graduation year and major subject are required for alumni' }, { status: 400 });
    }

    if (userType === 'student' && !collegeEmail) {
      return NextResponse.json({ error: 'College email is required for students' }, { status: 400 });
    }

    // Update user profile with user type and verification data
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        currentStatus: userType,
        ...(userType === 'alumni' && {
          yearsOfExperience: new Date().getFullYear() - parseInt(graduationYear),
        }),
        updatedAt: new Date(),
      },
      create: {
        userId,
        currentStatus: userType,
        ...(userType === 'alumni' && {
          yearsOfExperience: new Date().getFullYear() - parseInt(graduationYear),
        }),
      },
    });

    // If user is alumni, save education details
    if (userType === 'alumni') {
      await prisma.education.upsert({
        where: {
          userId_degree: {
            userId,
            degree: majorSubject
          }
        },
        update: {
          fieldOfStudy: majorSubject,
          endDate: new Date(parseInt(graduationYear), 5, 1), // June 1st of graduation year
          isCurrent: false,
        },
        create: {
          userId,
          degree: 'Bachelor\'s Degree',
          fieldOfStudy: majorSubject,
          endDate: new Date(parseInt(graduationYear), 5, 1), // June 1st of graduation year
          isCurrent: false,
          institutionName: 'University',
        },
      });
    }

    // If user is student, we would send OTP to college email here
    // For now, we'll just mark the user as verified
    if (userType === 'student') {
      // In a real implementation, you would send an OTP to the college email
      // and verify it before marking the user as complete
      console.log(`Would send OTP to ${collegeEmail} for user ${userId}`);
    }

    // Update user's onboarding status
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        role: userType, // Set role to student or alumni
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        ...user,
        profile
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving user type:', error);
    return NextResponse.json({ error: 'Failed to save user type' }, { status: 500 });
  }
}

// GET /api/user-type - Check if user has completed onboarding
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prisma client
    const prisma = await getPrismaClient();

    // Check if user has completed onboarding
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has provided user type
    const hasCompletedOnboarding = !!user.profile?.currentStatus;

    return NextResponse.json({ 
      hasCompletedOnboarding,
      userType: user.profile?.currentStatus,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error checking onboarding status:', error);
    return NextResponse.json({ error: 'Failed to check onboarding status' }, { status: 500 });
  }
}