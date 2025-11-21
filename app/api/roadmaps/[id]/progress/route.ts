import { NextRequest, NextResponse } from 'next/server';
import getPrismaClient from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req);
    console.log('PUT /api/roadmaps/[id]/progress - Auth user ID:', userId);
    
    if (!userId) {
      console.log('PUT /api/roadmaps/[id]/progress - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roadmapId = params.id;
    const { milestoneId, completed } = await req.json();
    
    console.log('PUT /api/roadmaps/[id]/progress - Request data:', { roadmapId, milestoneId, completed });

    // Get the prisma client
    const prisma = await getPrismaClient();

    // Check if the roadmap belongs to the user
    const roadmap = await prisma.roadmap.findUnique({
      where: { 
        id: roadmapId,
        userId: userId 
      }
    });

    if (!roadmap) {
      console.log('PUT /api/roadmaps/[id]/progress - Roadmap not found or not owned by user');
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }

    // Parse the phases JSON data
    let updatedPhases: any[] = [];
    if (typeof roadmap.phases === 'string') {
      try {
        updatedPhases = JSON.parse(roadmap.phases);
      } catch (e) {
        updatedPhases = [];
      }
    } else if (typeof roadmap.phases === 'object' && roadmap.phases !== null) {
      // Handle Prisma JSON objects that might be serialized differently in production
      if (!Array.isArray(roadmap.phases)) {
        // Check if it's a Prisma JSON object with numeric keys
        const keys = Object.keys(roadmap.phases);
        if (keys.length > 0) {
          // Check if all keys are numeric (0, 1, 2, ...)
          const numericKeys = keys.filter(key => !isNaN(Number(key)));
          
          if (numericKeys.length === keys.length) {
            // All keys are numeric, convert to array
            const array: any[] = [];
            for (let i = 0; i < numericKeys.length; i++) {
              if (roadmap.phases.hasOwnProperty(i)) {
                array.push(roadmap.phases[i]);
              }
            }
            updatedPhases = array;
          } else {
            // Check if it's a nested object structure that needs flattening
            // This handles cases where Prisma returns { '0': { ... }, '1': { ... } }
            if (keys.some(key => !isNaN(Number(key)))) {
              // Has some numeric keys, try to convert
              const array: any[] = [];
              keys.sort((a, b) => Number(a) - Number(b)).forEach(key => {
                if (!isNaN(Number(key)) && roadmap.phases && typeof roadmap.phases === 'object' && roadmap.phases !== null) {
                  array.push((roadmap.phases as any)[key]);
                }
              });
              updatedPhases = array;
            } else {
              // Try to wrap single object in array
              updatedPhases = [roadmap.phases];
            }
          }
        } else {
          // Try to wrap single object in array
          updatedPhases = [roadmap.phases];
        }
      } else {
        // Already an array
        updatedPhases = [...roadmap.phases];
      }
    } else if (Array.isArray(roadmap.phases)) {
      updatedPhases = [...roadmap.phases];
    }
    
    // Find and update the specific milestone
    let milestoneFound = false;
    for (const phase of updatedPhases) {
      if (phase && typeof phase === 'object' && 'milestones' in phase) {
        const phaseObj = phase as { milestones: any[] };
        if (Array.isArray(phaseObj.milestones)) {
          for (let i = 0; i < phaseObj.milestones.length; i++) {
            if (phaseObj.milestones[i] && phaseObj.milestones[i].id === milestoneId) {
              phaseObj.milestones[i].completed = completed;
              milestoneFound = true;
              break;
            }
          }
        }
        if (milestoneFound) break;
      }
    }

    if (!milestoneFound) {
      console.log('PUT /api/roadmaps/[id]/progress - Milestone not found');
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    // Update the roadmap in the database
    const updatedRoadmap = await prisma.roadmap.update({
      where: { id: roadmapId },
      data: {
        phases: updatedPhases
      }
    });

    console.log('PUT /api/roadmaps/[id]/progress - Roadmap updated successfully:', JSON.stringify(updatedRoadmap, null, 2));
    
    // Calculate new progress
    let totalMilestones = 0;
    let completedMilestones = 0;
    
    // Handle the updated roadmap phases data
    let phasesArray: any[] = [];
    if (Array.isArray(updatedRoadmap.phases)) {
      phasesArray = updatedRoadmap.phases;
    } else if (typeof updatedRoadmap.phases === 'string') {
      try {
        phasesArray = JSON.parse(updatedRoadmap.phases);
      } catch (e) {
        phasesArray = [];
      }
    } else if (typeof updatedRoadmap.phases === 'object' && updatedRoadmap.phases !== null) {
      // Handle Prisma JSON objects that might be serialized differently in production
      if (!Array.isArray(updatedRoadmap.phases)) {
        // Check if it's a Prisma JSON object with numeric keys
        const keys = Object.keys(updatedRoadmap.phases);
        if (keys.length > 0) {
          // Check if all keys are numeric (0, 1, 2, ...)
          const numericKeys = keys.filter(key => !isNaN(Number(key)));
          
          if (numericKeys.length === keys.length) {
            // All keys are numeric, convert to array
            const array: any[] = [];
            for (let i = 0; i < numericKeys.length; i++) {
              if (updatedRoadmap.phases.hasOwnProperty(i)) {
                array.push(updatedRoadmap.phases[i]);
              }
            }
            phasesArray = array;
          } else {
            // Check if it's a nested object structure that needs flattening
            // This handles cases where Prisma returns { '0': { ... }, '1': { ... } }
            if (keys.some(key => !isNaN(Number(key)))) {
              // Has some numeric keys, try to convert
              const array: any[] = [];
              keys.sort((a, b) => Number(a) - Number(b)).forEach(key => {
                if (!isNaN(Number(key)) && updatedRoadmap.phases && typeof updatedRoadmap.phases === 'object' && updatedRoadmap.phases !== null) {
                  array.push((updatedRoadmap.phases as any)[key]);
                }
              });
              phasesArray = array;
            } else {
              // Try to wrap single object in array
              phasesArray = [updatedRoadmap.phases];
            }
          }
        } else {
          // Try to wrap single object in array
          phasesArray = [updatedRoadmap.phases];
        }
      } else {
        // Already an array
        phasesArray = updatedRoadmap.phases;
      }
    }
    
    phasesArray.forEach(phase => {
      if (phase && typeof phase === 'object' && 'milestones' in phase) {
        const phaseObj = phase as { milestones: any[] };
        if (Array.isArray(phaseObj.milestones)) {
          totalMilestones += phaseObj.milestones.length;
          completedMilestones += phaseObj.milestones.filter(m => m && typeof m === 'object' && m.completed === true).length;
        }
      }
    });
    
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
    
    return NextResponse.json({ 
      message: 'Progress updated successfully',
      progress: progress,
      milestones: {
        completed: completedMilestones,
        total: totalMilestones
      }
    });
  } catch (error) {
    console.error('PUT /api/roadmaps/[id]/progress - Failed to update progress:', error);
    return NextResponse.json({ error: 'Failed to update progress', details: (error as Error).message }, { status: 500 });
  }
}