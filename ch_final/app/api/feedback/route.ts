import { NextRequest, NextResponse } from 'next/server';
import getPrismaClient from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import nodemailer from 'nodemailer';

// POST /api/feedback - Submit feedback
export async function POST(req: NextRequest) {
  try {
    const { feedbackType, rating, message, email } = await req.json();
    
    // Get the authenticated user (if available)
    const { userId } = getAuth(req as any);
    
    // Validate required fields
    if (!message) {
      return NextResponse.json({ error: 'Feedback message is required' }, { status: 400 });
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    // Check if user exists in database before associating feedback
    let validUserId = null;
    if (userId) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });
        if (user) {
          validUserId = userId;
        }
      } catch (userError) {
        console.warn('User not found in database, creating feedback without user association');
      }
    }
    
    // Save feedback to database
    const feedback = await prisma.feedback.create({
      data: {
        userId: validUserId,
        feedbackType: feedbackType || 'general',
        rating: rating || null,
        message: message,
        email: email || null,
        status: 'new'
      }
    });
    
    // Send email notification to contactbabycollab@gmail.com
    try {
      // Check if email credentials are configured
      const emailUser = process.env.EMAIL_USER || 'contactbabycollab@gmail.com';
      const emailPass = process.env.EMAIL_PASS;
      
      // Only attempt to send email if credentials are provided
      if (emailPass) {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });
        
        // Define email content
        const mailOptions = {
          from: emailUser,
          to: 'contactbabycollab@gmail.com',
          subject: `New Feedback Submission - ${feedbackType || 'General'}`,
          text: `
New Feedback Submission:

Type: ${feedbackType || 'General'}
${rating ? `Rating: ${rating}/5
` : ''}
Message:
${message}

${email ? `User's Email: ${email}
` : ''}
${validUserId ? `User ID: ${validUserId}
` : ''}
Feedback ID: ${feedback.id}
Date: ${new Date().toISOString()}
          `,
          html: `
<!DOCTYPE html>
<html>
<head>
    <title>New Feedback Submission</title>
</head>
<body>
    <h2>New Feedback Submission</h2>
    <p><strong>Type:</strong> ${feedbackType || 'General'}</p>
    ${rating ? `<p><strong>Rating:</strong> ${rating}/5</p>` : ''}
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
    ${email ? `<p><strong>User's Email:</strong> ${email}</p>` : ''}
    ${validUserId ? `<p><strong>User ID:</strong> ${validUserId}</p>` : ''}
    <p><strong>Feedback ID:</strong> ${feedback.id}</p>
    <p><strong>Date:</strong> ${new Date().toISOString()}</p>
</body>
</html>
          `
        };
        
        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Feedback email sent successfully');
      } else {
        console.log('Email credentials not configured. Skipping email notification.');
      }
    } catch (emailError) {
      console.error('Error sending feedback email:', emailError);
      // Don't fail the request if email sending fails, just log it
    }
    
    console.log('New feedback submitted:', feedback);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Feedback submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ 
      error: 'Failed to submit feedback', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}