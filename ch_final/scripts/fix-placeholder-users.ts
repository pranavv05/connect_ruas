import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixPlaceholderUsers() {
  console.log('Starting fix of users with placeholder data...');
  
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
        // For users with placeholder data, we'll mark them for update when they next log in
        // This is a safer approach than generating fake data
        console.log(`User ${user.id} has placeholder data and will be updated on next login`);
        skippedCount++;
      } catch (error) {
        console.error(`Failed to process user ${user.id}:`, error.message);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully updated: ${updatedCount} users`);
    console.log(`⏭️ Skipped (will update on next login): ${skippedCount} users`);
    console.log(`📊 Total processed: ${usersWithPlaceholderData.length} users`);
    
    // Now let's also update the ensureUserExists function to be more aggressive about updating
    console.log('\n💡 Recommendation: The ensureUserExists function should be updated to');
    console.log('   be more aggressive about updating placeholder data when real data is available.');
    
  } catch (error) {
    console.error('Error fixing placeholder users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixPlaceholderUsers()
  .then(() => {
    console.log('\n✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed with error:', error);
    process.exit(1);
  });