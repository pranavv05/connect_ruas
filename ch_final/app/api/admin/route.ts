import { NextRequest, NextResponse } from 'next/server';
import getPrismaClient from '@/lib/db';

// Hardcoded admin credentials as requested
const ADMIN_EMAIL = 'admin@babycollab.com';
const ADMIN_PASSWORD = 'admin@123456';

// POST /api/admin - Admin login to get feedback
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    // Validate credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    // Get all feedback ordered by creation date (newest first)
    const feedback = await prisma.feedback.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    });
    
    // Transform feedback data for the response
    const transformedFeedback = feedback.map(item => ({
      id: item.id,
      feedbackType: item.feedbackType,
      rating: item.rating,
      message: item.message,
      email: item.email,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
      user: item.user ? {
        id: item.user.id,
        name: item.user.fullName,
        email: item.user.email
      } : null
    }));
    
    return NextResponse.json({ 
      success: true,
      feedback: transformedFeedback
    });
  } catch (error) {
    console.error('Error fetching admin feedback:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch feedback', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}