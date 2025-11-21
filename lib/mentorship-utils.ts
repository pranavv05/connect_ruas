import { getPrismaClient } from "@/lib/db";

export interface Mentorship {
  id: string;
  mentorId: string;
  menteeId: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  mentor: {
    id: string;
    fullName: string | null;
    username: string;
    avatarUrl: string | null;
    role: string;
  };
  mentee: {
    id: string;
    fullName: string | null;
    username: string;
    avatarUrl: string | null;
    role: string;
  };
  sessions: MentorshipSession[];
}

export interface MentorshipSession {
  id: string;
  mentorshipId: string;
  scheduledAt: Date;
  duration: number;
  topic: string;
  notes: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// In a real implementation, these functions would fetch from the API
// For now, we'll return mock data

export async function getMentorships(userId: string): Promise<Mentorship[]> {
  // Mock data - in a real implementation, this would fetch from /api/mentorship
  return [
    {
      id: "1",
      mentorId: "mentor-1",
      menteeId: userId,
      status: "active",
      startDate: new Date(),
      endDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      mentor: {
        id: "mentor-1",
        fullName: "Alex Johnson",
        username: "alexj",
        avatarUrl: null,
        role: "Senior Developer"
      },
      mentee: {
        id: userId,
        fullName: "Current User",
        username: "currentuser",
        avatarUrl: null,
        role: "Student"
      },
      sessions: [
        {
          id: "session-1",
          mentorshipId: "1",
          scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
          duration: 60,
          topic: "React Performance Optimization",
          notes: null,
          status: "scheduled",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  ];
}

export async function requestMentorship(mentorId: string, message: string): Promise<Mentorship> {
  // Mock data - in a real implementation, this would POST to /api/mentorship
  return {
    id: "new-mentorship",
    mentorId,
    menteeId: "current-user-id",
    status: "pending",
    startDate: null,
    endDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    mentor: {
      id: mentorId,
      fullName: "Mentor Name",
      username: "mentor",
      avatarUrl: null,
      role: "Expert"
    },
    mentee: {
      id: "current-user-id",
      fullName: "Current User",
      username: "currentuser",
      avatarUrl: null,
      role: "Student"
    },
    sessions: []
  };
}

export async function getMentorshipSessions(userId: string): Promise<MentorshipSession[]> {
  // Mock data - in a real implementation, this would fetch from /api/mentorship/sessions
  return [
    {
      id: "session-1",
      mentorshipId: "1",
      scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
      duration: 60,
      topic: "React Performance Optimization",
      notes: null,
      status: "scheduled",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
}

export async function scheduleMentorshipSession(
  mentorshipId: string,
  scheduledAt: Date,
  duration: number,
  topic: string
): Promise<MentorshipSession> {
  // Mock data - in a real implementation, this would POST to /api/mentorship/sessions
  return {
    id: "new-session",
    mentorshipId,
    scheduledAt,
    duration,
    topic,
    notes: null,
    status: "scheduled",
    createdAt: new Date(),
    updatedAt: new Date()
  };
}