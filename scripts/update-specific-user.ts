import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * This script demonstrates how to manually update a specific user's data
 * Usage: npx ts-node scripts/update-specific-user.ts <userId> <newEmail> <newFullName>
 */

async function updateSpecificUser() {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: npx ts-node scripts/update-specific-user.ts <userId> <newEmail> <newFullName>');
    console.log('Example: npx ts-node scripts/update-specific-user.ts user_123 john@example.com "John Doe"');
    process.exit(1);
  }
  
  const [userId, newEmail, newFullName] = args;
  
  console.log(`Updating user ${userId} with email: ${newEmail}, name: ${newFullName}`);
  
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      console.log(`❌ User ${userId} not found`);
      process.exit(1);
    }
    
    console.log(`Found user: ${existingUser.email} (${existingUser.fullName})`);
    
    // Update user with new data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        fullName: newFullName
      }
    });
    
    console.log(`✅ Successfully updated user ${userId}`);
    console.log(`New data: ${updatedUser.email} (${updatedUser.fullName})`);
    
  } catch (error) {
    console.error('Error updating user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateSpecificUser();