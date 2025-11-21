# User Data Update Guide

## Problem

Users in the database are being stored with placeholder data:
- Email: `random@example.com` or `[userId]@example.com`
- Name: `User`, `User-123`, `user_abc`, etc.

## Solution

We've implemented a multi-layered approach to fix this issue:

### 1. Enhanced User Creation Logic

We've updated the user creation and update logic in several key files:
- `lib/user-creation.ts` - More aggressive updating of placeholder data
- `lib/user-data-updater.ts` - Enhanced update logic
- `app/api/profile/route.ts` - Better handling of user data on profile access
- `app/api/users/[id]/route.ts` - Improved user data updates

### 2. Scripts for Fixing Existing Data

We've created two scripts to help fix existing user data:

#### Script 1: Update Users with Clerk Data
```bash
npx ts-node scripts/update-users-with-clerk-data.ts
```

This script connects directly to Clerk's API to fetch real user data and update the database.

#### Script 2: Identify Users with Placeholder Data
```bash
npx ts-node scripts/fix-placeholder-users.ts
```

This script identifies users with placeholder data but doesn't modify anything.

### 3. Automatic Fix on User Login

The enhanced logic will automatically fix user data when users next log in to the application.

## How to Run the Fix Scripts

1. Make sure you have the required environment variables in your `.env` file:
   - `CLERK_SECRET_KEY` - Your Clerk secret key

2. Run the Clerk data update script:
   ```bash
   npx ts-node scripts/update-users-with-clerk-data.ts
   ```

3. Monitor the console output for any errors or issues.

## Prevention

The enhanced user creation logic will prevent new users from getting placeholder data in most cases by:
1. Being more aggressive about detecting and updating placeholder data
2. Prioritizing Clerk session data over fallback data
3. Continuously checking for real data on each user interaction

## Testing

After running the scripts, you can verify the fix by:
1. Checking the database directly to see if user emails and names have been updated
2. Logging in as affected users to verify their profile data is correct
3. Viewing user profiles in the application to ensure real data is displayed