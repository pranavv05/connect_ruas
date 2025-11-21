# User Data Fix Documentation

## Problem Description

Users in the database are being stored with placeholder data:
- Email: `random@example.com` or `[userId]@example.com`
- Name: `User`, `User-123`, `user_abc`, etc.

This happens because:
1. When users first sign up, Clerk may not immediately provide real email/name data
2. The system falls back to placeholder data to create the user record
3. Subsequent updates don't always catch when real data becomes available

## Solution Implemented

### 1. Enhanced User Creation Logic (`lib/user-creation.ts`)

Made the `ensureUserExists` function more aggressive about updating placeholder data when real data becomes available:

```typescript
// Before: Only update if user has placeholder data AND we have real data
if (hasPlaceholderEmail || hasGenericName) && (hasRealEmail || hasRealName)

// After: Update if user has placeholder data OR we have real data that's different
if (hasPlaceholderEmail || hasGenericName || (hasRealEmail && email !== user.email) || (hasRealName && fullName !== user.fullName))
```

### 2. Enhanced User Data Updater (`lib/user-data-updater.ts`)

Made the `updateUserWithRealData` function more aggressive:

```typescript
// Before: Only update if user has placeholder data AND we have real data
if ((hasPlaceholderEmail || hasGenericName) && (realEmail || realFullName))

// After: Update if we have any real data that's different from current data
if ((hasPlaceholderEmail || hasGenericName || realEmail || realFullName) && (realEmail || realFullName))
```

### 3. Enhanced API Routes

Updated both `/api/profile` and `/api/users/[id]` routes to be more aggressive about updating user data when real data from Clerk is available.

## How to Fix Existing Users

### Option 1: Automatic Fix (Recommended)
Users with placeholder data will automatically get updated when they next log in, as the enhanced logic will detect their placeholder data and replace it with real data from Clerk.

### Option 2: Manual Fix Script
Run the `scripts/fix-placeholder-users.ts` script to identify users with placeholder data. However, note that this script doesn't actually fix the data - it just identifies users who will be fixed on next login.

### Option 3: Admin Interface
Create an admin interface to manually update user data by connecting to Clerk's API and fetching real user information.

## Prevention for Future Users

The enhanced logic will prevent new users from getting placeholder data in most cases by:
1. Being more aggressive about detecting and updating placeholder data
2. Prioritizing Clerk session data over fallback data
3. Continuously checking for real data on each user interaction

## Testing the Fix

1. Log in as a user with placeholder data
2. Visit your profile page
3. The user's real email and name should now be displayed
4. Check the database to confirm the user record was updated