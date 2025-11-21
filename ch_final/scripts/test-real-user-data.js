// Simple test script to check if real user data is being captured
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');

async function getPrismaClient() {
  // Check if we have Turso database credentials
  const tursoDatabaseUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  // Use Turso if credentials are provided
  if (tursoDatabaseUrl && tursoAuthToken) {
    try {
      const adapter = new PrismaLibSQL({
        url: tursoDatabaseUrl,
        authToken: tursoAuthToken,
      });
      return new PrismaClient({ adapter });
    } catch (error) {
      console.error('Failed to initialize Turso client:', error);
      throw error;
    }
  }

  // Fallback to local SQLite
  return new PrismaClient();
}

let prisma;

async function initPrisma() {
  prisma = await getPrismaClient();
}

async function testRealUserData() {
  console.log('Testing if real user data is being captured...');
  
  try {
    // Initialize Prisma client
    await initPrisma();
    
    // Find a few users to check their data
    const users = await prisma.user.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`\nFound ${users.length} users:`);
    users.forEach((user, index) => {
      const isPlaceholderEmail = user.email.endsWith('@example.com');
      const isPlaceholderName = user.fullName === 'User' || 
        user.fullName.startsWith('User-') || 
        user.fullName.startsWith('user_') ||
        user.fullName.includes('User ') ||
        user.fullName === 'Project Creator' ||
        user.fullName === 'Project Member';
      
      console.log(`${index + 1}. ${user.id}:`);
      console.log(`   Email: ${user.email} ${isPlaceholderEmail ? '(PLACEHOLDER)' : '(REAL)'}`);
      console.log(`   Name: ${user.fullName} ${isPlaceholderName ? '(PLACEHOLDER)' : '(REAL)'}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });
    
    // Count placeholder vs real data
    const placeholderEmailCount = users.filter(user => user.email.endsWith('@example.com')).length;
    const placeholderNameCount = users.filter(user => 
      user.fullName === 'User' || 
      user.fullName.startsWith('User-') || 
      user.fullName.startsWith('user_') ||
      user.fullName.includes('User ') ||
      user.fullName === 'Project Creator' ||
      user.fullName === 'Project Member'
    ).length;
    
    console.log(`\nSummary:`);
    console.log(`Users with placeholder emails: ${placeholderEmailCount}/${users.length}`);
    console.log(`Users with placeholder names: ${placeholderNameCount}/${users.length}`);
    
    if (placeholderEmailCount === 0 && placeholderNameCount === 0) {
      console.log('\n✅ All users have real data! The fix is working correctly.');
    } else {
      console.log('\n⚠️  Some users still have placeholder data. The fix may need more time to propagate.');
    }
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testRealUserData()
  .then(() => {
    console.log('\n✨ Test script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test script failed with error:', error);
    process.exit(1);
  });