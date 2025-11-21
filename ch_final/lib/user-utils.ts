import { User } from '@prisma/client';

/**
 * Get user display information (name and avatar)
 * This function ensures consistent display of user information across the application
 */
export function getUserDisplayInfo(user: any) {
  // Get the user's full name or fallback to username
  // Prioritize fullName from Clerk, then username, then 'User' as fallback
  let displayName = user?.fullName || user?.username || 'User';
  
  // If the display name is generic, try to get a better one
  if (isGenericUserName(displayName)) {
    // Try to get a better name from first and last name if available
    if (user?.firstName && user?.lastName) {
      displayName = `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      displayName = user.firstName;
    } else if (user?.lastName) {
      displayName = user.lastName;
    }
  }
  
  // If we still have a generic name, try to get the username if it's better
  if (isGenericUserName(displayName) && user?.username && !isGenericUserName(user.username)) {
    displayName = user.username;
  }
  
  // Get the user's avatar URL or generate initials
  const avatarUrl = user?.avatarUrl || null;
  const initials = getInitials(displayName);
  
  return {
    name: displayName,
    avatarUrl,
    initials
  };
}

/**
 * Get user initials from their name
 */
export function getInitials(name: string): string {
  if (!name) return 'UU';
  
  // Remove any non-printable characters
  const cleanName = name.replace(/[^\x20-\x7E]/g, '');
  
  if (!cleanName.trim()) return 'UU';
  
  return cleanName
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Get user display info by user ID
 * This function can be used to fetch user information for display purposes
 */
export async function getUserDisplayInfoById(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const user = await response.json();
    return getUserDisplayInfo(user);
  } catch (error) {
    console.error('Error fetching user display info:', error);
    // Return fallback values
    return {
      name: 'Unknown User',
      avatarUrl: null,
      initials: 'UU'
    };
  }
}

/**
 * Ensure user has proper display name
 * This function checks if a user name is generic and should be updated
 */
export function isGenericUserName(name: string): boolean {
  if (!name) return true;
  
  const genericPatterns = [
    'User',
    'Project Creator',
    'Project Member',
    'Unknown User',
    /^User-/,
    /^user_/,
    /^User\d+/,
    /^user\d+/,
  ];
  
  return genericPatterns.some(pattern => {
    if (typeof pattern === 'string') {
      return name === pattern;
    } else {
      return pattern.test(name);
    }
  });
}