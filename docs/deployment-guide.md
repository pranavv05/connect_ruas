# connectruas Deployment Guide

This guide provides detailed instructions for deploying the connectruas application to production on Vercel.

## Prerequisites

Before deploying, ensure you have:

1. A GitHub account with the repository cloned
2. A Vercel account
3. A Clerk account for authentication
4. Access to a production database (Vercel Postgres recommended)
5. A Gemini API key for AI features

## Step-by-Step Deployment

### 1. Prepare the Repository

1. Ensure all changes are committed and pushed to your GitHub repository
2. Verify the repository structure matches the expected format
3. Run the verification script locally to check for issues:
   ```bash
   npm run verify-production
   ```
   
   This script will automatically load environment variables from your [.env](file:///C:/Users/prana/OneDrive/Desktop/ch_final/.env) file and verify that all required components are properly configured.

### 2. Create a Vercel Project

1. Log in to your Vercel account
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: Leave as is (root of repository)
   - Build Command: `next build`
   - Output Directory: `.next`

### 3. Configure Environment Variables

In your Vercel project settings, add the following environment variables:

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for frontend | `pk_live_xxx` |
| `CLERK_SECRET_KEY` | Clerk secret key for backend | `sk_live_xxx` |
| `DATABASE_URL` | Production database connection string | `postgres://user:pass@host:port/db` |
| `GEMINI_API_KEY` | Gemini API key for AI features | `AIzaSyxxx` |

### 4. Set Up Database

#### Option A: Vercel Postgres (Recommended)

1. In your Vercel project, go to the "Storage" tab
2. Click "Create Database"
3. Select "Vercel Postgres"
4. Follow the setup wizard
5. Vercel will automatically set the `DATABASE_URL` environment variable

#### Option B: External Database

1. Set up your database provider (PostgreSQL)
2. Obtain the connection string
3. Set the `DATABASE_URL` environment variable in Vercel

### 5. Configure Clerk Authentication

1. Log in to your Clerk dashboard
2. Create a new application or use an existing one
3. In the application settings, add your production domain to "Allowed Origins"
4. Update the redirect URLs:
   - Sign-in: `https://your-domain.vercel.app/sign-in`
   - Sign-up: `https://your-domain.vercel.app/sign-up`
5. Copy the publishable and secret keys to Vercel environment variables

### 6. Set Up AI Features

1. Obtain a Gemini API key from Google AI Studio
2. Add it to the `GEMINI_API_KEY` environment variable in Vercel

### 7. Deploy the Application

1. Click "Deploy" in Vercel
2. Wait for the build process to complete
3. Vercel will automatically run:
   - `npm install` (or equivalent)
   - `next build`
   - Database migrations (if configured)

### 8. Post-Deployment Setup

1. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
   
2. Seed initial data if needed:
   ```bash
   npm run prisma:seed
   ```

3. Set up production database (if needed):
   ```bash
   npm run db:setup-production
   ```

### 9. Verify Deployment

1. Visit your deployed application
2. Test the health check endpoint: `GET /api/health`
3. Test user registration and login
4. Test core functionality (projects, roadmaps, etc.)

## Monitoring and Maintenance

### Health Checks

Use the built-in health check endpoint:
```
GET /api/health
```

### Database Monitoring

- Set up alerts for database connectivity issues
- Monitor query performance
- Set up backup and recovery procedures

### Error Monitoring

Consider integrating error monitoring services like:
- Sentry
- LogRocket
- Rollbar

### Performance Monitoring

- Set up performance monitoring with tools like:
  - Vercel Analytics
  - Google Analytics
  - New Relic

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Ensure all required environment variables are configured in Vercel
   - Check that variables are set for the correct environment (Production)

2. **Database Connection Issues**
   - Verify the `DATABASE_URL` is correct
   - Check database credentials
   - Ensure the database is accessible from Vercel

3. **Clerk Authentication Issues**
   - Verify redirect URLs in Clerk dashboard
   - Check that API keys are correct
   - Ensure allowed origins include your domain

4. **Build Failures**
   - Check Vercel build logs for specific error messages
   - Ensure all dependencies are correctly specified in package.json
   - Verify TypeScript compilation

### Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.dev/docs)
- [Vercel Documentation](https://vercel.com/docs)

## Updating the Application

To update your deployed application:

1. Push changes to your GitHub repository
2. Vercel will automatically detect changes and start a new deployment
3. Monitor the deployment progress in the Vercel dashboard
4. Test the updated application after deployment completes

## Rollback Procedure

If issues are discovered after deployment:

1. In the Vercel dashboard, go to the "Deployments" tab
2. Find the previous working deployment
3. Click the "..." menu and select "Rollback"
4. Confirm the rollback action
5. Vercel will redeploy the previous version

## Security Considerations

1. Never commit sensitive environment variables to version control
2. Use strong, unique passwords for all services
3. Regularly rotate API keys
4. Keep dependencies up to date
5. Monitor for security vulnerabilities