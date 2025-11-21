import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import getPrismaClient from '@/lib/db';
import { ensureUserExists } from '@/lib/user-creation';
import { formatRoadmapData } from '@/lib/roadmap-utils';

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = getAuth(req);
    console.log('POST /api/roadmaps - Auth user ID:', userId);
    
    if (!userId) {
      console.log('POST /api/roadmaps - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prisma client
    const prisma: any = await getPrismaClient();

    const roadmap = await req.json();
    console.log('POST /api/roadmaps - Received roadmap data:', JSON.stringify(roadmap, null, 2));

    // Validate required fields
    if (!roadmap.title) {
      console.log('POST /api/roadmaps - Title is required');
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Log the phases data for debugging
    console.log('POST /api/roadmaps - Phases data type:', typeof roadmap.phases);
    console.log('POST /api/roadmaps - Phases data:', JSON.stringify(roadmap.phases, null, 2));

    // Validate that the roadmap has content - more robust validation
    const hasContent = roadmap.phases && 
      Array.isArray(roadmap.phases) && 
      roadmap.phases.length > 0 && 
      roadmap.phases.some((phase: any) => {
        // Check if phase is an object and has milestones
        if (!phase || typeof phase !== 'object') return false;
        
        // Check if milestones exists and is an array with items
        const milestones = phase.milestones || [];
        return Array.isArray(milestones) && milestones.length > 0;
      });

    if (!hasContent) {
      console.log('POST /api/roadmaps - Roadmap has no content (phases or milestones)');
      return NextResponse.json({ 
        error: 'Roadmap must have at least one phase with milestones' 
      }, { status: 400 });
    }

    // Get email and full name from session claims
    const email = (sessionClaims?.email as string) || `${userId}@example.com`;
    const fullName = (sessionClaims?.fullName as string) || 'User';
    
    // Ensure user exists with proper data
    const user = await ensureUserExists(prisma, userId, email, fullName);

    // Log the data that will be saved to the database
    console.log('POST /api/roadmaps - Saving roadmap data to DB:', {
      title: roadmap.title,
      description: roadmap.description || '',
      phases: roadmap.phases || [],
      userId: user.id
    });

    // Ensure phases data is properly formatted as an array before saving
    let phasesToSave = roadmap.phases || [];
    
    // If phases is a string, try to parse it
    if (typeof phasesToSave === 'string') {
      try {
        phasesToSave = JSON.parse(phasesToSave);
      } catch (e) {
        console.error('POST /api/roadmaps - Failed to parse phases JSON for saving:', e);
        phasesToSave = [];
      }
    }
    
    // Ensure phases is an array
    if (!Array.isArray(phasesToSave)) {
      // If it's an object, try to convert it to an array
      if (typeof phasesToSave === 'object' && phasesToSave !== null) {
        const keys = Object.keys(phasesToSave);
        if (keys.length > 0) {
          // Check if all keys are numeric (0, 1, 2, ...)
          const numericKeys = keys.filter(key => !isNaN(Number(key)));
          if (numericKeys.length === keys.length) {
            // All keys are numeric, convert to array
            const array: any[] = [];
            for (let i = 0; i < numericKeys.length; i++) {
              if (phasesToSave.hasOwnProperty(i)) {
                array.push(phasesToSave[i]);
              }
            }
            phasesToSave = array;
          } else {
            // Wrap single object in array
            phasesToSave = [phasesToSave];
          }
        } else {
          // Wrap single object in array
          phasesToSave = [phasesToSave];
        }
      } else {
        // For any other type, default to empty array
        phasesToSave = [];
      }
    }

    // Create the roadmap
    const newRoadmap = await prisma.roadmap.create({
      data: {
        title: roadmap.title,
        description: roadmap.description || '',
        phases: phasesToSave, // Use the properly formatted phases data
        userId: user.id, // Associate the roadmap with the user
      },
    });

    console.log('POST /api/roadmaps - Created roadmap:', JSON.stringify(newRoadmap, null, 2));
    
    // Verify the saved data
    const savedRoadmap = await prisma.roadmap.findUnique({
      where: { id: newRoadmap.id }
    });
    
    console.log('POST /api/roadmaps - Verified saved roadmap:', JSON.stringify(savedRoadmap, null, 2));
    
    return NextResponse.json(newRoadmap, { status: 201 });
  } catch (error) {
    console.error('POST /api/roadmaps - Failed to save roadmap:', error);
    return NextResponse.json({ error: 'Failed to save roadmap', details: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  console.log('=== DEBUG: GET /api/roadmaps ===');
  console.log('Full request URL:', req.url);
  
  // Try multiple ways to parse the URL
  let urlObj1, urlObj2;
  try {
    urlObj1 = new URL(req.url);
    console.log('URL parsing method 1 - Success:', {
      href: urlObj1.href,
      search: urlObj1.search,
      searchParams: Object.fromEntries(urlObj1.searchParams.entries())
    });
  } catch (e) {
    console.log('URL parsing method 1 - Error:', e);
  }
  
  try {
    const baseUrl = `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host')}`;
    const fullPath = req.url.startsWith('/') ? req.url : req.url.replace(baseUrl, '');
    urlObj2 = new URL(fullPath, baseUrl);
    console.log('URL parsing method 2 - Success:', {
      href: urlObj2.href,
      search: urlObj2.search,
      searchParams: Object.fromEntries(urlObj2.searchParams.entries())
    });
  } catch (e) {
    console.log('URL parsing method 2 - Error:', e);
  }
  
  // Use the first method that worked
  const url = urlObj1 || urlObj2;
  if (!url) {
    console.log('Failed to parse URL, returning error');
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }
  
  const roadmapId = url.searchParams.get('id');
  const limit = url.searchParams.get('limit');
  
  console.log('Extracted parameters:', { roadmapId, limit });
  console.log('Roadmap ID details:', {
    value: roadmapId,
    type: typeof roadmapId,
    isNull: roadmapId === null,
    isUndefined: roadmapId === undefined,
    isEmpty: roadmapId === '',
    isWhitespace: typeof roadmapId === 'string' ? roadmapId.trim() === '' : false
  });
  
  // Extra debugging for roadmapId
  if (roadmapId) {
    console.log('Roadmap ID truthiness checks:');
    console.log('  !!roadmapId:', !!roadmapId);
    console.log('  roadmapId !== null:', roadmapId !== null);
    console.log('  roadmapId !== undefined:', roadmapId !== undefined);
    console.log('  roadmapId !== "null":', roadmapId !== "null");
    console.log('  roadmapId !== "undefined":', roadmapId !== "undefined");
    console.log('  roadmapId.trim() !== "":', roadmapId.trim() !== "");
  }
  
  // If a roadmap ID is provided, fetch that specific roadmap
  const shouldFetchSpecific = roadmapId && 
    roadmapId !== null && 
    roadmapId !== undefined && 
    roadmapId !== 'null' && 
    roadmapId !== 'undefined' && 
    roadmapId.trim() !== '';
    
  console.log('Should fetch specific roadmap:', shouldFetchSpecific);
  
  if (shouldFetchSpecific) {
    console.log('Calling getRoadmapById with ID:', roadmapId);
    return getRoadmapById(req, roadmapId);
  }
  
  console.log('GET /api/roadmaps - Calling general list endpoint');
  // Otherwise, fetch all roadmaps for the user (existing functionality)
  try {
    console.log('=== DEBUG: General list endpoint called ===');
    const { userId } = getAuth(req);
    console.log('GET /api/roadmaps - Auth user ID:', userId);
    
    if (!userId) {
      console.log('GET /api/roadmaps - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prisma client
    const prisma: any = await getPrismaClient();

    // Get roadmaps for the user directly through the userId field
    const roadmaps = await prisma.roadmap.findMany({
      where: {
        userId: userId
      },
      take: limit ? Math.max(1, Math.min(100, parseInt(limit) || 10)) : undefined // Limit between 1-100, default 10
    });

    console.log('GET /api/roadmaps - Database query returned', roadmaps.length, 'roadmaps');

    // Transform roadmaps to match the expected frontend structure
    const transformedRoadmaps = roadmaps.map((roadmap: any) => {
      // Calculate progress and milestone info from phases and milestones
      let totalMilestones = 0;
      let completedMilestones = 0;
      
      // Safely handle the phases JSON data - handle both string and parsed JSON
      let phasesData = roadmap.phases || [];
      
      // If phases is a string, try to parse it
      if (typeof phasesData === 'string') {
        try {
          phasesData = JSON.parse(phasesData);
        } catch (e) {
          console.error('Failed to parse phases JSON:', e);
          phasesData = [];
        }
      }
      
      if (Array.isArray(phasesData)) {
        phasesData.forEach((phase: any) => {
          // Type guard to ensure phase is an object with milestones
          if (phase && typeof phase === 'object' && 'milestones' in phase) {
            const phaseObj = phase as { milestones: any[] };
            if (Array.isArray(phaseObj.milestones)) {
              totalMilestones += phaseObj.milestones.length;
              completedMilestones += phaseObj.milestones.filter(m => m && typeof m === 'object' && m.completed === true).length;
            }
          }
        });
      }
      
      const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
      
      return {
        id: roadmap.id,
        title: roadmap.title,
        phase: "In Progress", // Default value, could be enhanced
        progress: progress,
        milestones: {
          completed: completedMilestones,
          total: totalMilestones
        }
      };
    }).filter((roadmap: any) => {
      // Filter out roadmaps without content
      return roadmap.milestones.total > 0;
    });

    console.log('GET /api/roadmaps - Transformed roadmaps:', JSON.stringify(transformedRoadmaps, null, 2));
    console.log('=== DEBUG: General list endpoint returning response ===');
    return NextResponse.json(transformedRoadmaps, { 
      status: 200
    });
  } catch (error) {
    console.error('GET /api/roadmaps - Failed to fetch roadmaps:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmaps', details: (error as Error).message }, { status: 500 });
  }
}

async function getRoadmapById(req: NextRequest, roadmapId: string) {
  console.log('=== DEBUG: getRoadmapById called ===');
  console.log('Roadmap ID parameter:', roadmapId);
  
  try {
    const { userId } = getAuth(req);
    console.log('GET /api/roadmaps/[id] - Auth user ID:', userId);
    
    if (!userId) {
      console.log('GET /api/roadmaps/[id] - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prisma client
    const prisma: any = await getPrismaClient();

    console.log(`GET /api/roadmaps/[id] - Fetching roadmap with ID: ${roadmapId} for user: ${userId}`);

    // Check if the roadmap belongs to the user
    const roadmap = await prisma.roadmap.findUnique({
      where: { 
        id: roadmapId,
        userId: userId 
      }
    });

    console.log('GET /api/roadmaps/[id] - Database query result:', roadmap ? 'Found' : 'Not found');
    
    if (!roadmap) {
      console.log(`GET /api/roadmaps/[id] - Roadmap not found or not owned by user. ID: ${roadmapId}, User: ${userId}`);
      // Let's also check if the roadmap exists at all (not owned by this user)
      const anyRoadmap = await prisma.roadmap.findUnique({
        where: { 
          id: roadmapId
        }
      });
      
      if (anyRoadmap) {
        console.log(`GET /api/roadmaps/[id] - Roadmap exists but is owned by another user. Owner: ${anyRoadmap.userId}`);
        return NextResponse.json({ error: 'Roadmap not found or not accessible' }, { status: 404 });
      } else {
        console.log(`GET /api/roadmaps/[id] - Roadmap does not exist in database`);
        return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
      }
    }

    // Log the raw roadmap data for debugging
    console.log('GET /api/roadmaps/[id] - Raw roadmap data from DB:', JSON.stringify(roadmap, null, 2));

    // Enhanced handling of Prisma JSON serialization issues
    let phasesData: any[] = roadmap.phases || [];
    
    // Log the type of phases data for debugging
    console.log('GET /api/roadmaps/[id] - Phases data type:', typeof roadmap.phases);
    console.log('GET /api/roadmaps/[id] - Phases data value:', roadmap.phases);
    
    // Handle different data types that might be stored in the database
    if (typeof roadmap.phases === 'string') {
      try {
        phasesData = JSON.parse(roadmap.phases);
        console.log('GET /api/roadmaps/[id] - Parsed string phases data:', JSON.stringify(phasesData, null, 2));
      } catch (e) {
        console.error('GET /api/roadmaps/[id] - Failed to parse string phases JSON:', e);
        phasesData = [];
      }
    } else if (typeof roadmap.phases === 'object' && roadmap.phases !== null) {
      // Handle Prisma JSON objects that might be serialized differently in production
      console.log('GET /api/roadmaps/[id] - Object phases data keys:', Object.keys(roadmap.phases));
      
      if (!Array.isArray(roadmap.phases)) {
        // Check if it's a Prisma JSON object with numeric keys
        const keys = Object.keys(roadmap.phases);
        if (keys.length > 0) {
          // Check if all keys are numeric (0, 1, 2, ...)
          const numericKeys = keys.filter(key => !isNaN(Number(key)));
          console.log('GET /api/roadmaps/[id] - Numeric keys found:', numericKeys);
          
          if (numericKeys.length === keys.length) {
            // All keys are numeric, convert to array
            const array: any[] = [];
            for (let i = 0; i < numericKeys.length; i++) {
              if (roadmap.phases.hasOwnProperty(i)) {
                array.push(roadmap.phases[i]);
              }
            }
            phasesData = array;
            console.log('GET /api/roadmaps/[id] - Converted Prisma JSON object with numeric keys to array:', JSON.stringify(phasesData, null, 2));
          } else {
            // Check if it's a nested object structure that needs flattening
            // This handles cases where Prisma returns { '0': { ... }, '1': { ... } }
            if (keys.some(key => !isNaN(Number(key)))) {
              // Has some numeric keys, try to convert
              const array: any[] = [];
              keys.sort((a, b) => Number(a) - Number(b)).forEach(key => {
                if (!isNaN(Number(key))) {
                  array.push(roadmap.phases[key]);
                }
              });
              phasesData = array;
              console.log('GET /api/roadmaps/[id] - Converted nested object structure to array:', JSON.stringify(phasesData, null, 2));
            } else {
              // Try to wrap single object in array
              phasesData = [roadmap.phases];
              console.log('GET /api/roadmaps/[id] - Wrapped object in array:', JSON.stringify(phasesData, null, 2));
            }
          }
        } else {
          // Try to wrap single object in array
          phasesData = [roadmap.phases];
          console.log('GET /api/roadmaps/[id] - Wrapped object in array:', JSON.stringify(phasesData, null, 2));
        }
      } else {
        // Already an array
        phasesData = roadmap.phases;
        console.log('GET /api/roadmaps/[id] - Using array phases data:', JSON.stringify(phasesData, null, 2));
      }
    } else {
      // For any other type (undefined, null, etc.), default to empty array
      phasesData = [];
      console.log('GET /api/roadmaps/[id] - Defaulting to empty phases array');
    }
    
    // Create a new roadmap object with properly formatted phases
    const formattedRoadmap = {
      ...roadmap,
      phases: Array.isArray(phasesData) ? phasesData : []
    };

    console.log('GET /api/roadmaps/[id] - Final formatted roadmap:', JSON.stringify(formattedRoadmap, null, 2));
    console.log('=== DEBUG: getRoadmapById returning response ===');
    return NextResponse.json(formattedRoadmap, { 
      status: 200
    });
  } catch (error) {
    console.error('GET /api/roadmaps/[id] - Failed to fetch roadmap:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmap', details: (error as Error).message }, { status: 500 });
  }
}

// Add DELETE endpoint for deleting roadmaps
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    console.log('DELETE /api/roadmaps - Auth user ID:', userId);
    
    if (!userId) {
      console.log('DELETE /api/roadmaps - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prisma client
    const prisma: any = await getPrismaClient();

    const { searchParams } = new URL(req.url);
    const roadmapId = searchParams.get('id');
    console.log('DELETE /api/roadmaps - Roadmap ID to delete:', roadmapId);

    if (!roadmapId) {
      console.log('DELETE /api/roadmaps - Roadmap ID is required');
      return NextResponse.json({ error: 'Roadmap ID is required' }, { status: 400 });
    }

    // Check if the roadmap belongs to the user
    const roadmap = await prisma.roadmap.findUnique({
      where: { 
        id: roadmapId,
        userId: userId 
      }
    });
    
    console.log('DELETE /api/roadmaps - Roadmap to delete:', roadmap);

    if (!roadmap) {
      console.log('DELETE /api/roadmaps - Roadmap not found or not owned by user');
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }

    // Delete the roadmap
    await prisma.roadmap.delete({
      where: { id: roadmapId }
    });
    
    console.log('DELETE /api/roadmaps - Roadmap deleted successfully');

    return NextResponse.json({ message: 'Roadmap deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/roadmaps - Failed to delete roadmap:', error);
    return NextResponse.json({ error: 'Failed to delete roadmap', details: (error as Error).message }, { status: 500 });
  }
}