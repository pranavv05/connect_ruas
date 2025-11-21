const { PrismaClient } = require('@prisma/client');

async function checkProjectStatuses() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking project statuses in database...\n');
    
    // Get all projects with their creators
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
      console.log(`- ${project.id}: "${project.title}" by ${project.creator.fullName}`);
      console.log(`  Status: ${project.status || 'NULL'}`);
      console.log(`  Created: ${project.createdAt}`);
    });
    
    // Check what statuses are used
    const statuses = new Set();
    projects.forEach(project => {
      statuses.add(project.status || 'NULL');
    });
    
    console.log('\nUnique statuses found:', Array.from(statuses));
    
  } catch (error) {
    console.error('Error checking project statuses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProjectStatuses();