import { PrismaClient } from '@prisma/client';

/**
 * Ensures a user exists in the database with proper email and name from Clerk
 * This function should be used in all API routes that might create users
 * 
 * @param prisma - Prisma client instance
 * @param userId - Clerk user ID
 * @param email - User's email from Clerk session claims
 * @param fullName - User's full name from Clerk session claims
 * @returns The user record
 */
export async function ensureUserExists(
  prisma: PrismaClient,
  userId: string,
  email: string,
  fullName: string
) {
  console.log('ensureUserExists called with:', { userId, email, fullName });
  
  // Validate that we have real data, not just placeholder data
  const hasRealEmail = email && !email.endsWith('@example.com') && email !== `${userId}@example.com`;
  const hasRealName = fullName && fullName !== 'User' && 
    !fullName.startsWith('User-') && !fullName.startsWith('user_') &&
    !(fullName.includes('User ') && fullName.length < 20) &&
    !(fullName.includes('user_') && fullName.length > 20);
  
  console.log('Data validation:', { hasRealEmail, hasRealName });
  
  // First, check if user exists in our database
  let user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  console.log('Existing user found:', user);

  // If user doesn't exist, create them
  if (!user) {
    console.log('Creating new user with data:', { userId, email, fullName });
    
    // Generate a unique username based on actual email if possible
    let username = email.split('@')[0] || `user_${userId.substring(0, 8)}`;
    
    // Ensure username is unique by checking database
    let userExists = await prisma.user.findUnique({
      where: { username: username }
    });
    
    console.log('Generated username:', username, 'User exists:', userExists);
    
    // If username exists, append a timestamp to make it unique
    if (userExists) {
      username = `user_${userId.substring(0, 8)}_${Date.now()}`;
      console.log('Username conflict, generated new username:', username);
    }
    
    user = await prisma.user.create({
      data: {
        id: userId,
        email: hasRealEmail ? email : `${userId}@example.com`, // Use actual email from Clerk if real
        username: username,
        fullName: hasRealName ? fullName : 'User', // Use actual name from Clerk if real
      },
    });
    
    console.log('New user created:', user);
  } else {
    // Always update user with real data from Clerk if they have placeholder data
    const hasPlaceholderEmail = user.email.endsWith('@example.com');
    const hasGenericName = 
      user.fullName === 'Project Creator' || 
      user.fullName === 'Project Member' || 
      user.fullName === 'User' ||
      user.fullName.startsWith('User-') ||
      user.fullName.startsWith('user_') ||
      (user.fullName.includes('User ') && user.fullName.length < 20) ||
      (user.fullName.includes('user_') && user.fullName.length > 20);
    
    console.log('Checking for placeholder data:', { hasPlaceholderEmail, hasGenericName });
    
    // Be more aggressive about updating with real data when available
    // Update if:
    // 1. User has placeholder data and we have real data
    // 2. We have real data that's different from what's currently stored
    const shouldUpdateEmail = (hasPlaceholderEmail && hasRealEmail) || (hasRealEmail && email !== user.email);
    const shouldUpdateName = (hasGenericName && hasRealName) || (hasRealName && fullName !== user.fullName);
    
    if (shouldUpdateEmail || shouldUpdateName) {
      console.log('Updating user with real data:', { 
        email, 
        fullName, 
        shouldUpdateEmail, 
        shouldUpdateName,
        currentEmail: user.email,
        currentName: user.fullName
      });
      
      const updateData: any = {};
      
      if (shouldUpdateEmail) {
        updateData.email = email;
      }
      
      if (shouldUpdateName) {
        updateData.fullName = fullName;
      }
      
      user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
      
      console.log('User updated:', user);
    }
  }
  
  return user;
}