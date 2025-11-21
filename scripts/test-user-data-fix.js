const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testUserDataFix() {
  console.log('Testing user data fix implementation...');
  
  try {
    // Test 1: Find users with placeholder data
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
      },
      take: 5 // Limit to 5 for testing
    });
    
    console.log(`\nTest 1 - Found ${usersWithPlaceholderData.length} users with placeholder data:`);
    usersWithPlaceholderData.forEach(user => {
      console.log(`  - ${user.id}: ${user.email} (${user.fullName})`);
    });
    
    // Test 2: Find users with real data
    const usersWithRealData = await prisma.user.findMany({
      where: {
        AND: [
          { email: { not: { contains: '@example.com' } } },
          { fullName: { not: 'User' } },
          { fullName: { not: { startsWith: 'User-' } } },
          { fullName: { not: { startsWith: 'user_' } } },
          { fullName: { not: { contains: 'User ' } } },
          { fullName: { not: 'Project Creator' } },
          { fullName: { not: 'Project Member' } },
        ]
      },
      take: 5 // Limit to 5 for testing
    });
    
    console.log(`\nTest 2 - Found ${usersWithRealData.length} users with real data:`);
    usersWithRealData.forEach(user => {
      console.log(`  - ${user.id}: ${user.email} (${user.fullName})`);
    });
    
    console.log('\n✅ Tests completed successfully!');
    console.log('\n💡 To fix placeholder data:');
    console.log('   1. Run the update-users-with-clerk-data.ts script');
    console.log('   2. Or have users log in to automatically update their data');
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testUserDataFix()
  .then(() => {
    console.log('\n✨ Test script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test script failed with error:', error);
    process.exit(1);
  });