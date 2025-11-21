const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updatePlaceholderUsers() {
  console.log('Starting update of users with placeholder data...');
  
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
    
    // Process each user with placeholder data
    for (const user of usersWithPlaceholderData) {
      console.log(`\nProcessing user ${user.id}: ${user.email} (${user.fullName})`);
      
      try {
        // Generate realistic replacements based on user ID
        const userIdPart = user.id.substring(0, 8);
        
        // Create a more realistic email
        const updatedEmail = user.email.endsWith('@example.com') 
          ? `user.${userIdPart}@updated-domain.com` 
          : user.email;
          
        // Create a more realistic name
        const updatedName = (user.fullName === 'User' || 
                            user.fullName.startsWith('User-') || 
                            user.fullName.startsWith('user_') ||
                            user.fullName === 'Project Creator' ||
                            user.fullName === 'Project Member' ||
                            user.fullName.includes('User '))
          ? `User ${userIdPart.toUpperCase()}`
          : user.fullName;
        
        // Prepare update data
        const updateData = {};
        
        if (updatedEmail !== user.email) {
          updateData.email = updatedEmail;
          console.log(`Will update email from ${user.email} to ${updatedEmail}`);
        }
        
        if (updatedName !== user.fullName) {
          updateData.fullName = updatedName;
          console.log(`Will update name from "${user.fullName}" to "${updatedName}"`);
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
          console.log(`No updates needed for user ${user.id}`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`Failed to update user ${user.id}:`, error.message);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully updated: ${updatedCount} users`);
    console.log(`⏭️ Skipped: ${skippedCount} users`);
    console.log(`📊 Total processed: ${usersWithPlaceholderData.length} users`);
    
  } catch (error) {
    console.error('Error updating placeholder users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updatePlaceholderUsers()
  .then(() => {
    console.log('\n✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed with error:', error);
    process.exit(1);
  });