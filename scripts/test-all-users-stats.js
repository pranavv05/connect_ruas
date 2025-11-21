const { PrismaClient } = require('@prisma/client');

// Helper function to safely parse phases data
function parsePhasesData(phases) {
  if (!phases) return [];
  
  try {
    // If it's already an array, return it
    if (Array.isArray(phases)) {
      return phases;
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof phases === 'string') {
      return JSON.parse(phases);
    }
    
    // If it's an object, convert it to an array
    if (typeof phases === 'object' && phases !== null) {
      // Check if it's already in the correct format
      if (phases.id && phases.title && phases.milestones) {
        return [phases];
      }
      
      // Convert object values to array
      return Object.values(phases).filter((value) => 
        typeof value === 'object' && value !== null && (value.id || value.title)
      );
    }
  } catch (error) {
    console.error('Error parsing phases data:', error);
  }
  
  return [];
}

// Helper function to count milestones
function countMilestones(phases) {
  let total = 0;
  let completed = 0;
  
  phases.forEach(phase => {
    if (phase && typeof phase === 'object' && Array.isArray(phase.milestones)) {
      total += phase.milestones.length;
      completed += phase.milestones.filter((m) => 
        m && typeof m === 'object' && m.completed === true
      ).length;
    }
  });
  
  return { total, completed };
}

async function testAllUsersStats() {
  const prisma = new PrismaClient();
  
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true
      }
    });
    
    console.log('Testing stats logic for all users...\n');
    
    for (const user of users) {
      console.log(`\n=== USER: ${user.fullName} (${user.id}) ===`);
      
      // Get user's roadmaps
      const roadmaps = await prisma.roadmap.findMany({
        where: {
          userId: user.id
        },
        select: {
          id: true,
          title: true,
          phases: true,
          createdAt: true
        }
      });
      
      // Get projects where user is creator
      const createdProjects = await prisma.project.findMany({
        where: {
          creatorId: user.id
        },
        select: {
          id: true,
          title: true,
          status: true
        }
      });
      
      // Get projects where user is member
      const projectMemberships = await prisma.projectMember.findMany({
        where: {
          userId: user.id
        },
        select: {
          project: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        }
      });
      
      console.log(`Roadmaps: ${roadmaps.length}, Created Projects: ${createdProjects.length}, Project Memberships: ${projectMemberships.length}`);
      
      // Calculate active roadmaps and completed milestones
      let activeRoadmaps = 0;
      let completedMilestones = 0;
      let totalMilestones = 0;
      
      roadmaps.forEach((roadmap) => {
        // Parse phases data properly
        const phases = parsePhasesData(roadmap.phases);
        
        // Count total and completed milestones
        const { total, completed } = countMilestones(phases);
        
        // Add to totals
        totalMilestones += total;
        completedMilestones += completed;
        
        // Count as active if it has milestones
        if (total > 0) {
          activeRoadmaps++;
        }
      });
      
      // Create a set to deduplicate projects (in case user is both creator and member)
      const projectSet = new Set();
      const allProjects = [];
      
      // Add created projects
      createdProjects.forEach((project) => {
        if (!projectSet.has(project.id)) {
          projectSet.add(project.id);
          allProjects.push(project);
        }
      });
      
      // Add project memberships
      projectMemberships.forEach((pm) => {
        if (!projectSet.has(pm.project.id)) {
          projectSet.add(pm.project.id);
          allProjects.push(pm.project);
        }
      });
      
      const totalProjects = allProjects.length;
      
      // Count project statuses correctly (improved logic)
      let projectsInProgress = 0;
      let projectsCompleted = 0;
      
      allProjects.forEach((project) => {
        const status = project.status ? project.status.toLowerCase() : '';
        
        // Count as completed only if explicitly marked as completed
        if (status === 'completed') {
          projectsCompleted++;
        } 
        // Count as in progress if it's active or in_progress
        else if (status === 'active' || status === 'in_progress') {
          projectsInProgress++;
        }
        // planning status is not counted as in progress
      });
      
      // Calculate skills learned (using completed milestones as a proxy)
      const skillsLearned = completedMilestones;
      
      // Calculate career progress (0-100%)
      let careerProgress = 0;
      if (totalMilestones > 0) {
        careerProgress = Math.round((completedMilestones / totalMilestones) * 100);
      }
      
      // Transform the data to match the frontend expectations
      const stats = {
        activeRoadmaps: activeRoadmaps,
        totalProjects: totalProjects,
        skillsLearned: skillsLearned,
        careerProgress: careerProgress,
        roadmapsInProgress: activeRoadmaps,
        projectsCompleted: projectsCompleted,
        projectsInProgress: projectsInProgress,
        skillsThisMonth: 0, // Simplified for this test
        progressThisMonth: careerProgress > 0 ? Math.min(careerProgress, 100) : 0
      };
      
      console.log('Stats:', JSON.stringify(stats, null, 2));
    }
    
  } catch (error) {
    console.error('Error testing stats logic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAllUsersStats();