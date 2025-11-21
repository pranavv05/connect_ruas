# Mentorship Feature Documentation

## Overview
The mentorship feature allows users to connect with industry experts for career guidance and skill development. Users can find mentors, request mentorship, schedule sessions, and communicate through the built-in chat system.

## Features Implemented

### 1. Mentorship Dashboard Tab
- Added a "Mentorship" tab to the main dashboard
- Shows key metrics: active mentors, upcoming sessions, total hours
- Lists current mentors with quick access to profile and chat

### 2. Dedicated Mentorship Pages
- **Main Mentorship Page** (`/mentorship`): Central hub with tabs for:
  - My Mentors: List of current mentors with details
  - Sessions: Upcoming and past mentoring sessions
  - Discover: Find new mentors to connect with
- **Find Mentor Page** (`/mentorship/find`): Search and browse potential mentors
- **Chat Page** (`/chat`): Direct messaging with mentors and other users

### 3. Backend Implementation
- **Database Models**:
  - `Mentorship`: Tracks mentor-mentee relationships
  - `MentorshipSession`: Records scheduled mentoring sessions
- **API Endpoints**:
  - `GET /api/mentorship`: Fetch user's mentorships
  - `POST /api/mentorship`: Request mentorship
  - `GET /api/mentorship/sessions`: Fetch mentorship sessions
  - `POST /api/mentorship/sessions`: Schedule a session
  - `GET /api/chat`: Fetch user conversations
  - `POST /api/chat`: Send messages

### 4. UI Components
- **Mentorship Preview**: Dashboard widget showing mentorship summary
- **Mentor Cards**: Detailed mentor information with expertise and ratings
- **Session Scheduler**: Interface for booking mentoring sessions
- **Chat Integration**: Direct messaging from mentor profiles

## Key Functionality

### Finding Mentors
1. Browse recommended mentors on the Discover tab
2. Search mentors by name, expertise, or company
3. Filter mentors by specialization area
4. View mentor profiles with detailed information

### Requesting Mentorship
1. Click "Connect" on a mentor's profile
2. Send a personalized message explaining your goals
3. Wait for mentor to accept the request
4. Start scheduling sessions once accepted

### Scheduling Sessions
1. Navigate to the Sessions tab
2. Click "Schedule a new session"
3. Select mentor, date, time, and topic
4. Receive confirmation and calendar reminders

### Communicating with Mentors
1. Click the chat icon on any mentor card
2. Send direct messages through the chat interface
3. View conversation history
4. Receive notifications for new messages

## Technical Implementation

### Database Schema
```prisma
model Mentorship {
  id          String   @id @default(uuid())
  mentorId    String   @map("mentor_id")
  menteeId    String   @map("mentee_id")
  status      String   @default("pending") // pending, accepted, rejected, ended
  startDate   DateTime? @map("start_date")
  endDate     DateTime? @map("end_date")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  mentor      User     @relation("MentorRelation", fields: [mentorId], references: [id], onDelete: Cascade)
  mentee      User     @relation("MenteeRelation", fields: [menteeId], references: [id], onDelete: Cascade)
  sessions    MentorshipSession[]

  @@unique([mentorId, menteeId])
  @@index([mentorId])
  @@index([menteeId])
  @@index([status])
  @@map("mentorships")
}

model MentorshipSession {
  id           String   @id @default(uuid())
  mentorshipId String   @map("mentorship_id")
  scheduledAt  DateTime @map("scheduled_at")
  duration     Int      // in minutes
  topic        String
  notes        String?
  status       String   @default("scheduled") // scheduled, completed, cancelled
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  mentorship   Mentorship @relation(fields: [mentorshipId], references: [id], onDelete: Cascade)

  @@index([mentorshipId])
  @@index([scheduledAt])
  @@index([status])
  @@map("mentorship_sessions")
}
```

### API Routes
- `/api/mentorship` - Manage mentorship relationships
- `/api/mentorship/sessions` - Manage mentoring sessions
- `/api/chat` - Handle chat messages and conversations

## Future Enhancements
1. Mentorship program templates
2. Skill tracking and progress reports
3. Session recording and note-taking
4. Mentorship feedback and ratings system
5. Group mentoring sessions
6. Calendar integration