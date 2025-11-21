import { NextResponse } from "next/server";
import getPrismaClient from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

// GET /api/users/[id] - Get user profile data
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    // Fetch user data
    let user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        profile: true,
        skills: true,
        education: true,
        experience: true,
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Always try to get real data from the requesting user's session if they're the same user
    const { userId, sessionClaims } = getAuth(req as any);
    
    if (userId === id) {
      // This is the user requesting their own data, update with real info from session
      const realEmail = (sessionClaims?.email as string) || user.email;
      const realName = (sessionClaims?.fullName as string) || user.fullName || 'User';
      
      console.log('User requesting their own data:', { userId, realEmail, realName });
      
      // Check if we have better data from Clerk
      const hasBetterEmail = realEmail && !realEmail.endsWith('@example.com');
      const hasBetterName = realName && realName !== 'User' && 
        !realName.startsWith('User-') && !realName.startsWith('user_') &&
        !(realName.includes('User ') && realName.length < 20) &&
        !(realName.includes('user_') && realName.length > 20);
      
      console.log('Has better data:', { hasBetterEmail, hasBetterName });
      
      // Always update user with real data from Clerk if they have placeholder data
      // CHANGED: Be even more aggressive about updating with real data when available
      const hasPlaceholderEmail = user.email.endsWith('@example.com');
      const hasGenericName = 
        user.fullName === 'Project Creator' || 
        user.fullName === 'Project Member' || 
        user.fullName === 'User' ||
        user.fullName.startsWith('User-') ||
        user.fullName.startsWith('user_') ||
        (user.fullName.includes('User ') && user.fullName.length < 20) ||
        (user.fullName.includes('user_') && user.fullName.length > 20);
      
      // Check if we have real data from Clerk
      const hasRealEmail = realEmail && !realEmail.endsWith('@example.com');
      const hasRealName = realName && realName !== 'User' && 
        !realName.startsWith('User-') && !realName.startsWith('user_') &&
        !(realName.includes('User ') && realName.length < 20) &&
        !(realName.includes('user_') && realName.length > 20);
      
      console.log('Has placeholder data:', { hasPlaceholderEmail, hasGenericName });
      
      // CHANGED: Be more aggressive about updating with real data when available
      if (hasPlaceholderEmail || hasGenericName || hasRealEmail || hasRealName) {
        console.log('Updating user with real data:', { realEmail, realName });
        user = await prisma.user.update({
          where: { id: id },
          data: {
            // CHANGED: Be more aggressive about updating with real data when available
            email: (hasRealEmail || hasPlaceholderEmail) && realEmail ? realEmail : user.email,
            fullName: (hasRealName || hasGenericName) && realName ? realName : user.fullName,
          },
          include: {
            profile: true,
            skills: true,
            education: true,
            experience: true,
          }
        });
        console.log('User updated:', user);
      }
    } else {
      // For other users, we should return the user data as is
      // If the user has placeholder data, it means their real data hasn't been updated yet
      // This can happen if they haven't logged in since we implemented the real data fetching
      console.log('Viewing user profile for user:', id);
      console.log('Current user data:', {
        email: user.email,
        fullName: user.fullName,
        hasPlaceholderEmail: user.email.endsWith('@example.com'),
        hasGenericName: user.fullName === 'Project Creator' || 
          user.fullName === 'Project Member' || 
          user.fullName === 'User' ||
          user.fullName.startsWith('User-') ||
          user.fullName.startsWith('user_') ||
          (user.fullName.includes('User ') && user.fullName.length < 20) ||
          (user.fullName.includes('user_') && user.fullName.length > 20)
      });
    }
    
    // Calculate stats
    const projectsJoined = await prisma.projectMember.count({
      where: { userId: id }
    });
    
    const roadmapsCreated = await prisma.roadmap.count({
      where: { userId: id }
    });
    
    // Count completed tasks from milestone progress
    // Since the milestone_progress model is not available in Prisma, we'll set this to 0 for now
    const tasksCompleted = 0;
    
    // Transform the data to match the frontend expectations
    const transformedUser = {
      id: user.id,
      name: user.fullName || user.username || 'User',
      email: user.email,
      avatar: user.avatarUrl, // Include the avatar URL directly
      role: user.role,
      bio: user.profile?.bio || '',
      location: user.profile?.location || '',
      websiteUrl: user.profile?.websiteUrl || '',
      githubUrl: user.profile?.githubUrl || '',
      linkedinUrl: user.profile?.linkedinUrl || '',
      twitterUrl: user.profile?.twitterUrl || '',
      currentStatus: user.profile?.currentStatus || '',
      yearsOfExperience: user.profile?.yearsOfExperience || 0,
      skills: user.skills.map(skill => skill.skillName),
      education: user.education.map(edu => ({
        id: edu.id,
        institutionName: edu.institutionName,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.endDate,
        isCurrent: edu.isCurrent,
        description: edu.description,
      })),
      experience: user.experience.map(exp => ({
        id: exp.id,
        companyName: exp.companyName,
        position: exp.position,
        employmentType: exp.employmentType,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrent: exp.isCurrent,
        description: exp.description,
      })),
      stats: {
        projectsJoined: projectsJoined,
        roadmapsCreated: roadmapsCreated,
        tasksCompleted: tasksCompleted,
        joinedDate: user.createdAt.toISOString(),
      }
    };
    
    return NextResponse.json(transformedUser);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// PUT /api/users/[id] - Update user profile data (for self-updates)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Get the authenticated user
    const { userId, sessionClaims } = getAuth(req as any);
    
    if (!userId || userId !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    console.log('PUT /api/users/[id] called with session claims:', sessionClaims);
    
    // Get real email and full name from Clerk session
    // CHANGED: Prefer Clerk session data over body data
    const sessionEmail = sessionClaims?.email as string;
    const sessionFullName = sessionClaims?.fullName as string;
    const realEmail = sessionEmail || body.email || `${userId}@example.com`;
    const realName = sessionFullName || body.fullName || 'User';
    
    console.log('Updating user with data:', { realEmail, realName });
    
    // Update user profile with real data from Clerk
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: realName,
        email: realEmail,
      },
    });
    
    console.log('User updated successfully:', updatedUser);
    
    // Update or create user profile
    const userProfile = await prisma.profile.upsert({
      where: { userId: userId },
      update: {
        bio: body.bio,
        location: body.location,
      },
      create: {
        userId: userId,
        bio: body.bio,
        location: body.location,
      },
    });
    
    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: updatedUser,
      profile: userProfile
    });
  } catch (err) {
    console.error('Error updating user profile:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}