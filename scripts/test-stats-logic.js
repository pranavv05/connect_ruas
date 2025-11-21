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

async function testStatsLogic() {
  const prisma = new PrismaClient();
  
  try {
    // Use the first real user ID from our database
    const userId = '0341de5a-db1c-4275-a9e4-ccfd8cba80bf'; // Alice Johnson
    
    console.log('Testing stats logic for user:', userId);
    
    // Get user's roadmaps
    const roadmaps = await prisma.roadmap.findMany({
      where: {
        userId: userId
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
        creatorId: userId
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
        userId: userId
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
    
    console.log('Roadmaps found:', roadmaps.length);
    console.log('Created projects:', createdProjects.length);
    console.log('Project memberships:', projectMemberships.length);
    
    // Calculate active roadmaps and completed milestones
    let activeRoadmaps = 0;
    let completedMilestones = 0;
    let totalMilestones = 0;
    
    roadmaps.forEach((roadmap) => {
      // Parse phases data properly
      const phases = parsePhasesData(roadmap.phases);
      console.log(`Roadmap ${roadmap.id} has ${phases.length} phases`);
      
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
    
    // Calculate progress this month (simplified)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const recentRoadmaps = roadmaps.filter((roadmap) => 
      roadmap.createdAt && new Date(roadmap.createdAt) >= oneMonthAgo
    );
    
    let recentCompletedMilestones = 0;
    
    recentRoadmaps.forEach((roadmap) => {
      // Parse phases data properly
      const phases = parsePhasesData(roadmap.phases);
      
      // Count completed milestones in recent roadmaps
      const { completed } = countMilestones(phases);
      recentCompletedMilestones += completed;
    });
    
    // Transform the data to match the frontend expectations
    const stats = {
      activeRoadmaps: activeRoadmaps,
      totalProjects: totalProjects,
      skillsLearned: skillsLearned,
      careerProgress: careerProgress,
      roadmapsInProgress: activeRoadmaps, // All roadmaps with milestones are considered active
      projectsCompleted: projectsCompleted,
      projectsInProgress: projectsInProgress,
      skillsThisMonth: recentCompletedMilestones,
      progressThisMonth: careerProgress > 0 ? Math.min(careerProgress, 100) : 0
    };
    
    console.log('\n=== CALCULATED STATS ===');
    console.log(JSON.stringify(stats, null, 2));
    
    console.log('\n=== DETAILED BREAKDOWN ===');
    console.log('Total roadmaps:', roadmaps.length);
    console.log('Active roadmaps:', activeRoadmaps);
    console.log('Total milestones:', totalMilestones);
    console.log('Completed milestones:', completedMilestones);
    console.log('Career progress:', careerProgress + '%');
    console.log('Total projects:', totalProjects);
    console.log('Projects in progress:', projectsInProgress);
    console.log('Projects completed:', projectsCompleted);
    console.log('Skills learned (completed milestones):', skillsLearned);
    console.log('Recent completed milestones:', recentCompletedMilestones);
    
  } catch (error) {
    console.error('Error testing stats logic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStatsLogic();