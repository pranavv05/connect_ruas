const { PrismaClient } = require('@prisma/client');

async function checkStatsData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking stats data in database...\n');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true
      }
    });
    
    console.log('Users in database:', users.length);
    users.forEach(user => {
      console.log(`- ${user.id}: ${user.email} (${user.fullName})`);
    });
    
    console.log('\n--- ROADMAPS ---');
    const roadmaps = await prisma.roadmap.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      }
    });
    
    console.log('Total roadmaps:', roadmaps.length);
    roadmaps.forEach(roadmap => {
      console.log(`- ${roadmap.id}: "${roadmap.title}" by ${roadmap.user.fullName} (${roadmap.user.id})`);
      console.log(`  Created: ${roadmap.createdAt}`);
      console.log(`  Phases: ${typeof roadmap.phases === 'string' ? roadmap.phases.substring(0, 100) + '...' : JSON.stringify(roadmap.phases, null, 2)}`);
    });
    
    console.log('\n--- PROJECTS ---');
    const projects = await prisma.project.findMany({
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      }
    });
    
    console.log('Total projects:', projects.length);
    projects.forEach(project => {
      console.log(`- ${project.id}: "${project.title}" by ${project.creator.fullName} (${project.creator.id})`);
      console.log(`  Status: ${project.status}`);
    });
    
    console.log('\n--- PROJECT MEMBERS ---');
    const projectMembers = await prisma.projectMember.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
    
    console.log('Total project memberships:', projectMembers.length);
    projectMembers.forEach(pm => {
      console.log(`- ${pm.user.fullName} (${pm.user.id}) -> ${pm.project.title} (${pm.project.id})`);
    });
    
  } catch (error) {
    console.error('Error checking stats data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStatsData();