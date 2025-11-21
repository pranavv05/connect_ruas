import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import getPrismaClient from '@/lib/db';

// POST /api/verify-college-email - Send OTP to college email
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
    
    const { collegeEmail } = body;

    // Validate email
    if (!collegeEmail) {
      return NextResponse.json({ error: 'College email is required' }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Generate a random OTP
    // 2. Store it in the database with an expiration time
    // 3. Send it to the user's college email
    
    // For this example, we'll just simulate the process
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    
    // Store OTP in database (in a real app, you'd have a separate table for this)
    await prisma.user.update({
      where: { id: userId },
      data: {
        // In a real implementation, you would store the OTP securely
        // For now, we'll just log it
        updatedAt: new Date(),
      },
    });
    
    // Simulate sending email (in a real app, you'd use an email service like SendGrid or Nodemailer)
    console.log(`Sending OTP ${otp} to ${collegeEmail} for user ${userId}`);
    
    // In a real implementation, you would send the actual email here
    // For now, we'll just return success
    
    return NextResponse.json({ 
      success: true,
      message: "OTP sent to your college email"
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

// PUT /api/verify-college-email - Verify OTP
export async function PUT(req: Request) {
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
    
    const { otp, collegeEmail } = body;

    // Validate OTP
    if (!otp) {
      return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Retrieve the stored OTP for this user
    // 2. Check if it matches and hasn't expired
    // 3. If valid, mark the email as verified
    
    // For this example, we'll just simulate a successful verification
    console.log(`Verifying OTP ${otp} for user ${userId} with email ${collegeEmail}`);
    
    // Update user's profile to mark email as verified
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        updatedAt: new Date(),
      },
      create: {
        userId,
      },
    });
    
    return NextResponse.json({ 
      success: true,
      message: "Email verified successfully"
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}