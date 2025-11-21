import { PrismaClient } from '@prisma/client';
import { createClerkClient } from '@clerk/backend';

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize Clerk client with secret key
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function updateUsersWithClerkData() {
  console.log('Starting update of users with real Clerk data...');
  
  try {
    // Find all users with placeholder data
    const usersWithPlaceholderData = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: '@example.com' } },
          { fullName: 'User' },
          { fullName: { startsWith: 'User-' } },
          { fullName: { startsWith: 'user_' } },
          { fullName: { contains: 'User ' } },
          { fullName: 'Project Creator' },
          { fullName: 'Project Member' },
        ]
      }
    });
    
    console.log(`Found ${usersWithPlaceholderData.length} users with placeholder data`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Process each user with placeholder data
    for (const user of usersWithPlaceholderData) {
      console.log(`\nProcessing user ${user.id}: ${user.email} (${user.fullName})`);
      
      try {
        // Fetch real user data from Clerk
        const clerkUser = await clerkClient.users.getUser(user.id);
        
        if (!clerkUser) {
          console.log(`❌ User ${user.id} not found in Clerk`);
          skippedCount++;
          continue;
        }
        
        // Extract real data from Clerk user
        const realEmail = clerkUser.emailAddresses[0]?.emailAddress || user.email;
        const realName = clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.firstName || clerkUser.lastName || user.fullName;
        
        console.log(` Clerk data: ${realEmail} (${realName})`);
        
        // Check if we have real data
        const hasRealEmail = realEmail && !realEmail.endsWith('@example.com');
        const hasRealName = realName && realName !== 'User' && 
          !realName.startsWith('User-') && !realName.startsWith('user_') &&
          !(realName.includes('User ') && realName.length < 20) &&
          !(realName.includes('user_') && realName.length > 20);
        
        if (!hasRealEmail && !hasRealName) {
          console.log(`⚠️  No real data available for user ${user.id}`);
          skippedCount++;
          continue;
        }
        
        // Prepare update data
        const updateData: any = {};
        
        if (hasRealEmail && realEmail !== user.email) {
          updateData.email = realEmail;
          console.log(` Will update email from ${user.email} to ${realEmail}`);
        }
        
        if (hasRealName && realName !== user.fullName) {
          updateData.fullName = realName;
          console.log(` Will update name from "${user.fullName}" to "${realName}"`);
        }
        
        // Only update if we have something to update
        if (Object.keys(updateData).length > 0) {
          const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData
          });
          
          console.log(`✅ Successfully updated user ${user.id}`);
          updatedCount++;
        } else {
          console.log(` No updates needed for user ${user.id}`);
          skippedCount++;
        }
      } catch (error: any) {
        console.error(`❌ Failed to update user ${user.id}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully updated: ${updatedCount} users`);
    console.log(`⏭️ Skipped: ${skippedCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);
    console.log(`📊 Total processed: ${usersWithPlaceholderData.length} users`);
    
  } catch (error) {
    console.error('Error updating users with Clerk data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateUsersWithClerkData()
  .then(() => {
    console.log('\n✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed with error:', error);
    process.exit(1);
  });