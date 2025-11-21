require('dotenv').config({ path: '.env.local' });

console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL);
console.log('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? '***REDACTED***' : 'NOT SET');

const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@libsql/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');

async function testDashboardStats() {
  let prisma;
  
  try {
    // Check if we have Turso database credentials
    const tursoDatabaseUrl = process.env.TURSO_DATABASE_URL;
    const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

    console.log('Database URL:', tursoDatabaseUrl);
    console.log('Auth Token:', tursoAuthToken ? 'SET' : 'NOT SET');

    // Use Turso if credentials are provided
    if (tursoDatabaseUrl && tursoAuthToken) {
      console.log('Using Turso database');
      const libsql = createClient({
        url: tursoDatabaseUrl,
        authToken: tursoAuthToken,
      });
      
      const adapter = new PrismaLibSQL(libsql);
      prisma = new PrismaClient({ adapter });
    } else {
      console.log('Using local SQLite database');
      prisma = new PrismaClient();
    }
    
    // Test connection
    await prisma.$connect();
    console.log('Connected to database successfully');
    
    // Check if there are any roadmaps
    const roadmapCount = await prisma.roadmap.count();
    console.log(`Total roadmaps in database: ${roadmapCount}`);
    
    // Check if there are any projects
    const projectCount = await prisma.project.count();
    console.log(`Total projects in database: ${projectCount}`);
    
    // Get a sample roadmap to see its structure
    const sampleRoadmap = await prisma.roadmap.findFirst({
      select: {
        id: true,
        title: true,
        phases: true,
        createdAt: true
      }
    });
    if (sampleRoadmap) {
      console.log('Sample roadmap:', JSON.stringify(sampleRoadmap, null, 2));
      console.log('Phases type:', typeof sampleRoadmap.phases);
      console.log('Phases content:', sampleRoadmap.phases);
    } else {
      console.log('No roadmaps found in database');
    }
    
    // Get a sample project to see its structure
    const sampleProject = await prisma.project.findFirst();
    if (sampleProject) {
      console.log('Sample project:', JSON.stringify(sampleProject, null, 2));
    } else {
      console.log('No projects found in database');
    }
    
  } catch (error) {
    console.error('Error testing database:', error);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

testDashboardStats();