console.log('Testing database connection...');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    
    // Simple query to test connection
    const count = await prisma.user.count();
    console.log(`Database connection successful. Found ${count} users.`);
    
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();