/**
 * Script to fix roadmap data that was stored incorrectly in the database
 * This addresses the issue where roadmap phases data was stored as objects 
 * instead of arrays in production environments.
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

async function fixRoadmapData() {
  let prisma;
  
  try {
    console.log('Starting roadmap data fix...');
    
    // Initialize Prisma client with the same configuration as the app
    prisma = await getPrisma();
    
    // Get all roadmaps
    const roadmaps = await prisma.roadmap.findMany();
    
    console.log(`Found ${roadmaps.length} roadmaps to check`);
    
    let fixedCount = 0;
    
    for (const roadmap of roadmaps) {
      let needsUpdate = false;
      let fixedPhases = roadmap.phases;
      
      // Log the current roadmap for debugging
      console.log(`Checking roadmap ${roadmap.id}:`, typeof roadmap.phases, Array.isArray(roadmap.phases));
      
      // Check if phases data is an object with numeric keys instead of an array
      if (typeof roadmap.phases === 'object' && roadmap.phases !== null && !Array.isArray(roadmap.phases)) {
        const keys = Object.keys(roadmap.phases);
        console.log(`Roadmap ${roadmap.id} has object phases with keys:`, keys);
        
        if (keys.length > 0) {
          // Check if all keys are numeric (0, 1, 2, ...)
          const numericKeys = keys.filter(key => !isNaN(Number(key)));
          console.log(`Roadmap ${roadmap.id} numeric keys:`, numericKeys);
          
          if (numericKeys.length === keys.length) {
            // All keys are numeric, convert to array
            const array = [];
            for (let i = 0; i < numericKeys.length; i++) {
              if (roadmap.phases.hasOwnProperty(i)) {
                array.push(roadmap.phases[i]);
              }
            }
            fixedPhases = array;
            needsUpdate = true;
            console.log(`Fixed roadmap ${roadmap.id}: converted object with numeric keys to array`);
          } else {
            // Check if it's a nested object structure that needs flattening
            if (keys.some(key => !isNaN(Number(key)))) {
              // Has some numeric keys, try to convert
              const array = [];
              keys.sort((a, b) => Number(a) - Number(b)).forEach(key => {
                if (!isNaN(Number(key))) {
                  array.push(roadmap.phases[key]);
                }
              });
              fixedPhases = array;
              needsUpdate = true;
              console.log(`Fixed roadmap ${roadmap.id}: converted nested object to array`);
            } else {
              // Try to wrap single object in array
              fixedPhases = [roadmap.phases];
              needsUpdate = true;
              console.log(`Fixed roadmap ${roadmap.id}: wrapped object in array`);
            }
          }
        } else {
          // Try to wrap single object in array
          fixedPhases = [roadmap.phases];
          needsUpdate = true;
          console.log(`Fixed roadmap ${roadmap.id}: wrapped object in array`);
        }
      }
      
      // Update the roadmap if needed
      if (needsUpdate) {
        console.log(`Updating roadmap ${roadmap.id} with fixed phases data`);
        await prisma.roadmap.update({
          where: { id: roadmap.id },
          data: { phases: fixedPhases }
        });
        fixedCount++;
      }
    }
    
    console.log(`Fixed ${fixedCount} roadmaps with incorrect phases data`);
    console.log('Roadmap data fix completed successfully');
    
  } catch (error) {
    console.error('Error fixing roadmap data:', error);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

// Run the script
fixRoadmapData();