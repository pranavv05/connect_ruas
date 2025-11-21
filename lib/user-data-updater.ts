import { PrismaClient } from '@prisma/client';

/**
 * Updates users with placeholder data to real data when available
 * This function should be called periodically or when users access their profiles
 * 
 * @param prisma - Prisma client instance
 * @returns Number of users updated
 */
export async function updateUsersWithRealData(prisma: PrismaClient): Promise<number> {
  console.log('Starting user data update process...');
  
  // Find users with placeholder data
  const usersWithPlaceholderData = await prisma.user.findMany({
    where: {
      OR: [
        { email: { endsWith: '@example.com' } },
        { fullName: 'User' },
        { fullName: { startsWith: 'User-' } },
        { fullName: { startsWith: 'user_' } },
        { fullName: { contains: 'User ' } },
        { fullName: { contains: 'user_' } },
      ]
    }
  });
  
  console.log(`Found ${usersWithPlaceholderData.length} users with placeholder data`);
  
  let updatedCount = 0;
  
  // For each user with placeholder data, we would need to get real data from Clerk
  // Since we can't do that from the server side without a session, we'll just log them
  // In a real implementation, this would be called from client-side with proper session data
  for (const user of usersWithPlaceholderData) {
    console.log('User with placeholder data:', {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt
    });
  }
  
  return updatedCount;
}

/**
 * Updates a specific user with real data if they have placeholder data
 * This function should be called when a user accesses their profile or logs in
 * 
 * @param prisma - Prisma client instance
 * @param userId - The user ID
 * @param realEmail - Real email from Clerk session (if available)
 * @param realFullName - Real full name from Clerk session (if available)
 * @returns Updated user or null if no update was needed
 */
export async function updateUserWithRealData(
  prisma: PrismaClient,
  userId: string,
  realEmail?: string,
  realFullName?: string
): Promise<any | null> {
  // First, check if user exists in our database
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    console.log('User not found for update:', userId);
    return null;
  }
  
  // Check if user has placeholder data
  const hasPlaceholderEmail = user.email.endsWith('@example.com');
  const hasGenericName = 
    user.fullName === 'Project Creator' || 
    user.fullName === 'Project Member' || 
    user.fullName === 'User' ||
    user.fullName.startsWith('User-') ||
    user.fullName.startsWith('user_') ||
    (user.fullName.includes('User ') && user.fullName.length < 20) ||
    (user.fullName.includes('user_') && user.fullName.length > 20);
  
  console.log('Checking user for real data update:', {
    userId,
    hasPlaceholderEmail,
    hasGenericName,
    hasRealEmail: !!realEmail,
    hasRealFullName: !!realFullName
  });
  
  // Be more aggressive about updating with real data when available
  // Update if:
  // 1. User has placeholder data and we have real data
  // 2. We have real data that's different from what's currently stored
  const hasRealEmail = realEmail && !realEmail.endsWith('@example.com') && realEmail !== `${userId}@example.com`;
  const hasRealName = realFullName && realFullName !== 'User' && 
    !realFullName.startsWith('User-') && !realFullName.startsWith('user_') &&
    !(realFullName.includes('User ') && realFullName.length < 20) &&
    !(realFullName.includes('user_') && realFullName.length > 20);
  
  const shouldUpdateEmail = (hasPlaceholderEmail && hasRealEmail) || (hasRealEmail && realEmail !== user.email);
  const shouldUpdateName = (hasGenericName && hasRealName) || (hasRealName && realFullName !== user.fullName);
  
  if (shouldUpdateEmail || shouldUpdateName) {
    console.log('Updating user with real data:', { 
      userId, 
      realEmail, 
      realFullName, 
      shouldUpdateEmail, 
      shouldUpdateName,
      currentEmail: user.email,
      currentName: user.fullName
    });
    
    const updateData: any = {};
    
    if (shouldUpdateEmail) {
      updateData.email = realEmail;
    }
    
    if (shouldUpdateName) {
      updateData.fullName = realFullName;
    }
    
    // Only update if we have something to update
    if (Object.keys(updateData).length > 0) {
      console.log('Updating user with real data:', { userId, updateData });
      
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData
      });
      
      console.log('User updated successfully:', updatedUser);
      return updatedUser;
    }
  }
  
  return null;
}