import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import getPrismaClient from '@/lib/db'

// GET /api/dashboard/roadmaps - Get active roadmaps for the authenticated user with full content
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient()
    
    // Get user's roadmaps with full content
    const roadmaps = await prisma.roadmap.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5 // Get only the most recent 5 roadmaps
    })
    
    // Transform the data to match the frontend expectations with full content
    const transformedRoadmaps = roadmaps.map((roadmap: any) => {
      // Handle phases data - parse if it's a string
      let phasesData = roadmap.phases || [];
      
      // If phases is a string, try to parse it
      if (typeof phasesData === 'string') {
        try {
          phasesData = JSON.parse(phasesData);
        } catch (e) {
          console.error('Failed to parse phases JSON:', e);
          phasesData = [];
        }
      } else if (typeof phasesData === 'object' && phasesData !== null) {
        // Handle Prisma JSON objects that might be serialized differently in production
        console.log('Dashboard roadmaps: Object phases data keys:', Object.keys(phasesData));
        
        if (!Array.isArray(phasesData)) {
          // Check if it's a Prisma JSON object with numeric keys
          const keys = Object.keys(phasesData);
          if (keys.length > 0) {
            // Check if all keys are numeric (0, 1, 2, ...)
            const numericKeys = keys.filter(key => !isNaN(Number(key)));
            console.log('Dashboard roadmaps: Numeric keys found:', numericKeys);
            
            if (numericKeys.length === keys.length) {
              // All keys are numeric, convert to array
              const array: any[] = [];
              for (let i = 0; i < numericKeys.length; i++) {
                if (phasesData.hasOwnProperty(i)) {
                  array.push(phasesData[i]);
                }
              }
              phasesData = array;
              console.log('Dashboard roadmaps: Converted Prisma JSON object with numeric keys to array:', JSON.stringify(phasesData, null, 2));
            } else {
              // Check if it's a nested object structure that needs flattening
              // This handles cases where Prisma returns { '0': { ... }, '1': { ... } }
              if (keys.some(key => !isNaN(Number(key)))) {
                // Has some numeric keys, try to convert
                const array: any[] = [];
                keys.sort((a, b) => Number(a) - Number(b)).forEach(key => {
                  if (!isNaN(Number(key))) {
                    array.push(phasesData[key]);
                  }
                });
                phasesData = array;
                console.log('Dashboard roadmaps: Converted nested object structure to array:', JSON.stringify(phasesData, null, 2));
              } else {
                // Try to wrap single object in array
                phasesData = [phasesData];
                console.log('Dashboard roadmaps: Wrapped object in array:', JSON.stringify(phasesData, null, 2));
              }
            }
          } else {
            // Try to wrap single object in array
            phasesData = [phasesData];
            console.log('Dashboard roadmaps: Wrapped object in array:', JSON.stringify(phasesData, null, 2));
          }
        } else {
          // Already an array
          phasesData = roadmap.phases;
          console.log('Dashboard roadmaps: Using array phases data:', JSON.stringify(phasesData, null, 2));
        }
      } else {
        // For any other type (undefined, null, etc.), default to empty array
        phasesData = [];
        console.log('Dashboard roadmaps: Defaulting to empty phases array');
      }
      
      // Ensure phasesData is an array
      if (!Array.isArray(phasesData)) {
        phasesData = [];
      }
      
      // Calculate progress from phases and milestones
      let totalMilestones = 0
      let completedMilestones = 0
      
      // Safely handle the phases JSON data
      phasesData.forEach((phase: any) => {
        // Type guard to ensure phase is an object with milestones
        if (phase && typeof phase === 'object' && 'milestones' in phase) {
          const phaseObj = phase as { milestones: any[] }
          if (Array.isArray(phaseObj.milestones)) {
            totalMilestones += phaseObj.milestones.length
            completedMilestones += phaseObj.milestones.filter(m => m && typeof m === 'object' && m.completed === true).length
          }
        }
      })
      
      const progress = totalMilestones > 0 
        ? Math.round((completedMilestones / totalMilestones) * 100) 
        : 0
      
      // Determine phase based on progress
      let phase = 'Foundation'
      if (progress >= 80) {
        phase = 'Advanced'
      } else if (progress >= 50) {
        phase = 'Intermediate'
      }
      
      // For due date, we'll use a simple approach since we don't have start dates
      const dueDate = progress < 100 ? 'In Progress' : 'Completed'
      
      return {
        id: roadmap.id,
        title: roadmap.title,
        description: roadmap.description,
        phases: phasesData, // Include full phases data
        progress: progress,
        phase: phase,
        dueDate: dueDate,
        createdAt: roadmap.createdAt,
        milestones: {
          completed: completedMilestones,
          total: totalMilestones
        }
      }
    })
    
    return NextResponse.json(transformedRoadmaps)
  } catch (error) {
    console.error('Error fetching dashboard roadmaps:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard roadmaps' }, { status: 500 })
  }
}