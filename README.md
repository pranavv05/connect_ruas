# connectruas - Student Collaboration Platform

## Overview

connectruas is a comprehensive platform designed for students to find teammates, collaborate on real-world projects, and build a portfolio that gets them hired. The platform provides tools for project management, roadmap tracking, resume building, and social networking.

## Features

### Dashboard
- Personalized dashboard with real-time statistics
- Quick access to recent projects and roadmaps
- Pending join requests management
- Resume status and AI suggestions
- Social connections management

### Projects
- Create and manage collaborative projects
- Team member recruitment and management
- Real-time chat and file sharing
- Task boards with progress tracking
- Join request system with approval workflow

### Roadmaps
- Career path planning with milestones
- Progress tracking and completion status
- Skill development tracking
- Personalized learning paths

### Resume Builder
- AI-powered resume creation and optimization
- Template selection and customization
- Skill highlighting and achievement showcasing
- Export to PDF functionality

### Social Features
- Profile management with detailed information
- Social connections (LinkedIn, GitHub, Twitter, Portfolio)
- Experience and education tracking
- Skill endorsements from teammates

## Technology Stack

### Frontend
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Lucide React Icons

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL Database
- Clerk Authentication

### Authentication
This project uses Clerk for authentication. The following environment variables are required:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

These are already configured in the `.env` file.

## User Data Fix

We've implemented a comprehensive solution to fix the issue where users were being stored with placeholder data (@example.com emails and generic names). 

### Solution Overview

1. **Enhanced User Creation Logic**: Made the user creation and update functions more aggressive about replacing placeholder data with real data from Clerk.

2. **Automatic Fix on Login**: Users with placeholder data will automatically get updated when they next log in.

3. **Manual Fix Scripts**: Created scripts to manually update user data:
   - `scripts/update-users-with-clerk-data.ts` - Connects to Clerk API to fetch real user data
   - `scripts/update-specific-user.ts` - Updates a specific user's data
   - `scripts/test-user-data-fix.ts` - Tests the implementation
   - `scripts/sync-all-clerk-users.ts` - Syncs all Clerk users to the database
   - `scripts/periodic-clerk-sync.js` - Runs periodic synchronization

### Running the Fix Scripts

```bash
# Test the current state
npx ts-node scripts/test-user-data-fix.ts

# Update specific user (example)
npx ts-node scripts/update-specific-user.ts user_123 john@example.com "John Doe"

# Update all users with real Clerk data
npx ts-node scripts/update-users-with-clerk-data.ts

# Sync all Clerk users to database
npx ts-node scripts/sync-all-clerk-users.ts
```

## API Endpoints

### Dashboard APIs
- `GET /api/dashboard/stats` - Fetch dashboard statistics
- `GET /api/dashboard/projects` - Fetch recent projects
- `GET /api/dashboard/roadmaps` - Fetch active roadmaps
- `GET /api/dashboard/resume` - Fetch resume information
- `POST /api/dashboard/resume` - Update resume
- `GET /api/dashboard/connections` - Fetch social connections
- `POST /api/dashboard/connections` - Add/update social connection
- `DELETE /api/dashboard/connections/[id]` - Remove social connection

### Project APIs
- `GET /api/projects` - Fetch all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Fetch project details
- `DELETE /api/projects/[id]` - Delete a project
- `POST /api/projects/[id]/join` - Request to join a project
- `GET /api/projects/[id]/join-requests` - Fetch project join requests
- `POST /api/projects/[id]/join-requests/[requestId]` - Accept/reject join request
- `GET /api/projects/[id]/messages` - Fetch project messages
- `POST /api/projects/[id]/messages` - Send a project message
- `POST /api/projects/[id]/files` - Upload a project file

### User APIs
- `GET /api/profile/[id]` - Fetch user profile
- `PUT /api/profile` - Update user profile
- `GET /api/users/[id]` - Fetch user details

### Join Request APIs
- `GET /api/join-requests` - Fetch all join requests for projects where user is admin

### Feedback APIs
- `POST /api/feedback` - Submit feedback
- `POST /api/admin` - Admin endpoint to view all feedback (requires credentials)

### Health Check
- `GET /api/health` - Check application health and database connection

## Database Schema

The application uses Prisma ORM with PostgreSQL database. The schema includes:

- Users with profile information, skills, education, and experience
- Projects with team members, join requests, messages, and files
- Roadmaps with milestones and progress tracking
- Resumes with templates and content
- Social connections
- Project join requests with approval workflow

## Deployment

Your project is live at:

**[https://vercel.com/pranavv05s-projects/v0-dashboard-m-o-n-k-y](https://vercel.com/pranavv05s-projects/v0-dashboard-m-o-n-k-y)**

### Deploying to Vercel

To deploy this application to Vercel:

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure the following environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key for production
   - `CLERK_SECRET_KEY` - Your Clerk secret key for production
   - `DATABASE_URL` - Your production database URL (PostgreSQL)
   - `GEMINI_API_KEY` - Your Gemini API key for AI features
   - `EMAIL_USER` - Email address for feedback notifications (optional)
   - `EMAIL_PASS` - App password for email account (optional)

4. For database setup, you can use Vercel Postgres or any external PostgreSQL provider
5. The build command is automatically detected as `next build`
6. The output directory is automatically detected as `.next`

### PostgreSQL Database Configuration

The application is configured to use PostgreSQL for production. You have two options:

1. **Vercel Postgres (Recommended)**: Create a Postgres database directly in your Vercel dashboard
2. **External PostgreSQL**: Use any PostgreSQL provider (Supabase, Render, AWS RDS, etc.)

Make sure your `DATABASE_URL` follows the format: `postgresql://username:password@hostname:port/database_name`

For SSL-enabled connections, add `?sslmode=require` to the URL.

### Database Migrations

Database migrations are automatically handled during the build process thanks to the `vercel-build` script already configured in your package.json:

```json
{
  "scripts": {
    "vercel-build": "prisma migrate deploy && next build"
  }
}

This means you don't need to manually run migrations after deployment. The script will automatically:
1. Run `prisma migrate deploy` to apply any pending database migrations
2. Run `next build` to build your Next.js application

### Admin Access

To view feedback submissions, make a POST request to `/api/admin` with the following credentials:

```json
{
  "email": "admin@connectruas.com",
  "password": "admin@123456"
}
```

See `docs/admin-api.md` for detailed documentation.

### User Data Fix

We've implemented a comprehensive solution to fix the issue where users were being stored with placeholder data (@example.com emails and generic names). 

See `docs/user-data-update-guide.md` and `docs/how-to-run-user-data-scripts.md` for detailed documentation on how to run the fix scripts.

### Environment Variables

For production deployment, make sure to set these environment variables in your Vercel dashboard:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_production_clerk_publishable_key
CLERK_SECRET_KEY=your_production_clerk_secret_key
DATABASE_URL=your_production_database_url
GEMINI_API_KEY=your_gemini_api_key
```

## Development Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables in `.env.local` file
4. Run database migrations: `npx prisma migrate dev`
5. Start the development server: `pnpm dev`

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/QCMHxGgAOHI](https://v0.app/chat/projects/QCMHxGgAOHI)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository