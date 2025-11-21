import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getPrismaClient } from '@/lib/db'

// GET /api/chat - Get user's conversations
export async function GET(req: Request) {
  const { userId } = getAuth(req as any);
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // In a real implementation, we would fetch conversations from the database
    // For now, we'll return mock data with real user IDs from the database
    const conversations = [
      {
        id: "0341de5a-db1c-4275-a9e4-ccfd8cba80bf", // Real user ID from database
        participants: [
          { id: "0341de5a-db1c-4275-a9e4-ccfd8cba80bf", name: "Alice Johnson", avatar: "AJ" },
          { id: userId, name: "You", avatar: "Y" }
        ],
        lastMessage: "Thanks for the feedback on my project!",
        timestamp: "2023-06-15T10:30:00Z",
        unreadCount: 2
      },
      {
        id: "8e6a2689-f73b-4809-9c88-8f1554903e0f", // Real user ID from database
        participants: [
          { id: "8e6a2689-f73b-4809-9c88-8f1554903e0f", name: "Bob Smith", avatar: "BS" },
          { id: userId, name: "You", avatar: "Y" }
        ],
        lastMessage: "Let's schedule our next session",
        timestamp: "2023-06-14T15:45:00Z",
        unreadCount: 0
      }
    ];

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

// POST /api/chat - Send a new message
export async function POST(req: Request) {
  const { userId } = getAuth(req as any);
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { conversationId, content } = await req.json();
    
    // In a real implementation, we would save the message to the database
    // For now, we'll return mock data
    const newMessage = {
      id: Date.now().toString(),
      content,
      senderId: userId,
      timestamp: new Date().toISOString(),
      conversationId
    };

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}