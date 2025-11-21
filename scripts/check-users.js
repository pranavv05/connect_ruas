const { PrismaClient } = require('@prisma/client');

async function checkUsers() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking users in database...');
    
    // Get a few users to see what we're working with
    const users = await prisma.user.findMany({
      take: 10,
      select: {
        id: true,
        email: true,
        fullName: true,
        username: true
      }
    });
    
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ${user.id}: ${user.email} (${user.fullName})`);
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
      select: {
        id: true,
        email: true,
        fullName: true,
        username: true
      }
    });
    
    console.log(`\nUsers with placeholder data: ${usersWithPlaceholderData.length}`);
    usersWithPlaceholderData.forEach(user => {
      console.log(`- ${user.id}: ${user.email} (${user.fullName})`);
    });
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();