const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

async function testDbConnection() {
  console.log('Testing database connection...');
  
  try {
    // Try a simple query to test the connection
    const userCount = await prisma.user.count();
    console.log(`✅ Database connection successful!`);
    console.log(`Found ${userCount} users in the database`);
    
    // Test fetching a few users
    const users = await prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        email: true,
        fullName: true
      }
    });
    
    console.log('\nSample users:');
    users.forEach(user => {
      console.log(`  - ${user.id}: ${user.email} (${user.fullName})`);
    });
    
    // Check for users with placeholder data
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
      take: 5,
      select: {
        id: true,
        email: true,
        fullName: true
      }
    });
    
    console.log(`\nUsers with placeholder data: ${usersWithPlaceholderData.length}`);
    if (usersWithPlaceholderData.length > 0) {
      console.log('These users need to be updated:');
      usersWithPlaceholderData.forEach(user => {
        console.log(`  - ${user.id}: ${user.email} (${user.fullName})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check your TURSO_DATABASE_URL in the .env file');
    console.log('2. Ensure your Turso database is accessible');
    console.log('3. Verify your authentication token is correct');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDbConnection()
  .then(() => {
    console.log('\n✨ Database test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Database test failed:', error);
    process.exit(1);
  });