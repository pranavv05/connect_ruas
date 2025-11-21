/**
 * Script to debug a specific roadmap and see what's actually stored in the database
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

async function debugRoadmap(roadmapId) {
  let prisma;
  
  try {
    console.log(`Debugging roadmap with ID: ${roadmapId}`);
    
    // Initialize Prisma client with the same configuration as the app
    prisma = await getPrisma();
    
    // Get the specific roadmap
    const roadmap = await prisma.roadmap.findUnique({
      where: { 
        id: roadmapId
      }
    });
    
    if (!roadmap) {
      console.log(`Roadmap with ID ${roadmapId} not found in database`);
      return;
    }
    
    console.log('Roadmap found in database:');
    console.log('ID:', roadmap.id);
    console.log('Title:', roadmap.title);
    console.log('User ID:', roadmap.userId);
    console.log('Created at:', roadmap.createdAt);
    console.log('Updated at:', roadmap.updatedAt);
    console.log('Phases type:', typeof roadmap.phases);
    console.log('Phases value:', roadmap.phases);
    
    if (roadmap.phases) {
      if (typeof roadmap.phases === 'object') {
        console.log('Phases keys:', Object.keys(roadmap.phases));
      }
      console.log('Phases JSON:', JSON.stringify(roadmap.phases, null, 2));
    } else {
      console.log('Phases is null or undefined');
    }
    
  } catch (error) {
    console.error('Error debugging roadmap:', error);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

// Get roadmap ID from command line arguments
const roadmapId = process.argv[2];

if (!roadmapId) {
  console.log('Usage: node scripts/debug-roadmap.js <roadmap-id>');
  console.log('Example: node scripts/debug-roadmap.js 49a36c69-614a-4c82-a2ef-e648f1915476');
  process.exit(1);
}

// Run the script
debugRoadmap(roadmapId);