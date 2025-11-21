/**
 * Script to test roadmap data retrieval and parsing
 * This verifies that the roadmap data can be correctly retrieved and parsed
 */

// Load environment variables
require('dotenv').config();

// Use the same database configuration as the app
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');

async function getPrisma() {
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

async function testRoadmapData() {
  let prisma;
  
  try {
    console.log('Testing roadmap data retrieval...');
    
    // Initialize Prisma client with the same configuration as the app
    prisma = await getPrisma();
    
    // Get all roadmaps
    const roadmaps = await prisma.roadmap.findMany();
    
    console.log(`Found ${roadmaps.length} roadmaps`);
    
    // Test the first roadmap
    if (roadmaps.length > 0) {
      const roadmap = roadmaps[0];
      console.log(`Testing roadmap ${roadmap.id}`);
      console.log(`Title: ${roadmap.title}`);
      console.log(`Phases type: ${typeof roadmap.phases}`);
      console.log(`Phases is array: ${Array.isArray(roadmap.phases)}`);
      
      if (Array.isArray(roadmap.phases)) {
        console.log(`Phases length: ${roadmap.phases.length}`);
        if (roadmap.phases.length > 0) {
          console.log(`First phase:`, JSON.stringify(roadmap.phases[0], null, 2));
        }
      } else if (typeof roadmap.phases === 'object' && roadmap.phases !== null) {
        console.log(`Phases keys:`, Object.keys(roadmap.phases));
      }
    }
    
    console.log('Roadmap data test completed successfully');
    
  } catch (error) {
    console.error('Error testing roadmap data:', error);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

// Run the script
testRoadmapData();