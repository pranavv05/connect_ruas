/**
 * Script to simulate the roadmap API logic and see what's happening
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

async function simulateGetRoadmapById(roadmapId, userId) {
  let prisma;
  
  try {
    console.log(`Simulating getRoadmapById with ID: ${roadmapId} for user: ${userId}`);
    
    // Initialize Prisma client with the same configuration as the app
    prisma = await getPrisma();

    // Check if the roadmap belongs to the user
    const roadmap = await prisma.roadmap.findUnique({
      where: { 
        id: roadmapId,
        userId: userId 
      }
    });

    if (!roadmap) {
      console.log(`Roadmap not found or not owned by user. ID: ${roadmapId}, User: ${userId}`);
      return null;
    }

    // Log the raw roadmap data for debugging
    console.log('Raw roadmap data from DB:', JSON.stringify(roadmap, null, 2));

    // Enhanced handling of Prisma JSON serialization issues
    let phasesData = roadmap.phases || [];
    
    // Log the type of phases data for debugging
    console.log('Phases data type:', typeof roadmap.phases);
    console.log('Phases data value:', roadmap.phases);
    
    // Handle different data types that might be stored in the database
    if (typeof roadmap.phases === 'string') {
      try {
        phasesData = JSON.parse(roadmap.phases);
        console.log('Parsed string phases data:', JSON.stringify(phasesData, null, 2));
      } catch (e) {
        console.error('Failed to parse string phases JSON:', e);
        phasesData = [];
      }
    } else if (typeof roadmap.phases === 'object' && roadmap.phases !== null) {
      // Handle Prisma JSON objects that might be serialized differently in production
      console.log('Object phases data keys:', Object.keys(roadmap.phases));
      
      if (!Array.isArray(roadmap.phases)) {
        // Check if it's a Prisma JSON object with numeric keys
        const keys = Object.keys(roadmap.phases);
        if (keys.length > 0) {
          // Check if all keys are numeric (0, 1, 2, ...)
          const numericKeys = keys.filter(key => !isNaN(Number(key)));
          console.log('Numeric keys found:', numericKeys);
          
          if (numericKeys.length === keys.length) {
            // All keys are numeric, convert to array
            const array = [];
            for (let i = 0; i < numericKeys.length; i++) {
              if (roadmap.phases.hasOwnProperty(i)) {
                array.push(roadmap.phases[i]);
              }
            }
            phasesData = array;
            console.log('Converted Prisma JSON object with numeric keys to array:', JSON.stringify(phasesData, null, 2));
          } else {
            // Check if it's a nested object structure that needs flattening
            // This handles cases where Prisma returns { '0': { ... }, '1': { ... } }
            if (keys.some(key => !isNaN(Number(key)))) {
              // Has some numeric keys, try to convert
              const array = [];
              keys.sort((a, b) => Number(a) - Number(b)).forEach(key => {
                if (!isNaN(Number(key))) {
                  array.push(roadmap.phases[key]);
                }
              });
              phasesData = array;
              console.log('Converted nested object structure to array:', JSON.stringify(phasesData, null, 2));
            } else {
              // Try to wrap single object in array
              phasesData = [roadmap.phases];
              console.log('Wrapped object in array:', JSON.stringify(phasesData, null, 2));
            }
          }
        } else {
          // Try to wrap single object in array
          phasesData = [roadmap.phases];
          console.log('Wrapped object in array:', JSON.stringify(phasesData, null, 2));
        }
      } else {
        // Already an array
        phasesData = roadmap.phases;
        console.log('Using array phases data:', JSON.stringify(phasesData, null, 2));
      }
    } else {
      // For any other type (undefined, null, etc.), default to empty array
      phasesData = [];
      console.log('Defaulting to empty phases array');
    }
    
    // Create a new roadmap object with properly formatted phases
    const formattedRoadmap = {
      ...roadmap,
      phases: Array.isArray(phasesData) ? phasesData : []
    };

    console.log('Final formatted roadmap:', JSON.stringify(formattedRoadmap, null, 2));
    return formattedRoadmap;
  } catch (error) {
    console.error('Failed to fetch roadmap:', error);
    return null;
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

const https = require('https');

// Test the suggest-roadmaps API
const postData = JSON.stringify({
  userProfile: {
    interest: "Web Development",
    experience: "Beginner",
    time: "5 hours per week",
    style: "Hands-on projects",
    goal: "Build a portfolio website"
  }
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/suggest-roadmaps',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:');
    console.log(data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(postData);
req.end();

// Get parameters from command line
const roadmapId = process.argv[2];
const userId = process.argv[3];

if (!roadmapId || !userId) {
  console.log('Usage: node scripts/test-roadmap-api.js <roadmap-id> <user-id>');
  console.log('Example: node scripts/test-roadmap-api.js 49a36c69-614a-4c82-a2ef-e648f1915476 user_33xTB5HsmGQY5DH9T7SV3ZqtquN');
  process.exit(1);
}

// Run the simulation
simulateGetRoadmapById(roadmapId, userId);