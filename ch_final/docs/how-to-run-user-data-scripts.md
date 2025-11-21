# How to Run User Data Fix Scripts

## Prerequisites

1. Make sure you have the required environment variables in your `.env` file:
   - `TURSO_DATABASE_URL` - Your Turso database URL
   - `CLERK_SECRET_KEY` - Your Clerk secret key

2. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

## Running the Scripts

### 1. Test User Data Fix Script
This script checks for users with placeholder data and users with real data:

```bash
node scripts/test-user-data-fix.js
```

### 2. Update Specific User Script
This script updates a specific user's data:

```bash
node scripts/update-specific-user.js <userId> <newEmail> <newFullName>
```

Example:
```bash
node scripts/update-specific-user.js user_123 john@example.com "John Doe"
```

### 3. Update Users with Clerk Data Script
This script connects to Clerk's API to fetch real user data:

```bash
node scripts/update-users-with-clerk-data.js
```

Note: We've provided a pre-compiled JavaScript version that works directly without TypeScript compilation.

## Troubleshooting

### Database Connection Issues
If you encounter database connection issues, make sure:
1. Your `TURSO_DATABASE_URL` is correctly set in the `.env` file
2. Your Turso database is accessible
3. You have the correct authentication token

### Clerk API Issues
If you encounter Clerk API issues, make sure:
1. Your `CLERK_SECRET_KEY` is correctly set in the `.env` file
2. The key has the necessary permissions to read user data

## Manual Database Update
If the scripts don't work, you can manually update user data using a database client:

```sql
UPDATE users 
SET email = 'real-email@example.com', 
    full_name = 'Real Name' 
WHERE id = 'user-id';
```

## Verification
After running the scripts, verify the fix by:
1. Checking the database directly
2. Logging in as affected users to verify their profile data
3. Viewing user profiles in the application