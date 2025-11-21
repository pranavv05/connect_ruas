const { createClient } = require('@libsql/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const { PrismaClient } = require('@prisma/client');

// Check if required environment variables are available
const tursoDatabaseUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoDatabaseUrl || !tursoAuthToken) {
  console.error('❌ TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables must be set');
  console.log('Please check your .env file');
  process.exit(1);
}

// Initialize Turso client
const client = createClient({
  url: tursoDatabaseUrl,
  authToken: tursoAuthToken,
});

// Initialize Prisma with LibSQL adapter
const adapter = new PrismaLibSQL({
  url: tursoDatabaseUrl,
  authToken: tursoAuthToken,
});

const prisma = new PrismaClient({ adapter });

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
    } else {
      console.log('✅ No users with placeholder data found!');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Check your TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in the .env file');
    console.log('2. Ensure your Turso database is accessible');
    console.log('3. Verify your authentication token is correct');
    console.log('4. Check that the Turso database URL includes the authToken parameter');
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