const { PrismaClient } = require('@prisma/client');

async function checkMentorshipData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking mentorship data in database...\n');
    
    // Get all mentorships
    const mentorships = await prisma.mentorship.findMany({
      include: {
        mentor: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        },
        mentee: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        }
      }
    });
    
    console.log('Total mentorships:', mentorships.length);
    mentorships.forEach(mentorship => {
      console.log(`- Mentor: ${mentorship.mentor.fullName} (${mentorship.mentor.id})`);
      console.log(`  Mentee: ${mentorship.mentee.fullName} (${mentorship.mentee.id})`);
      console.log(`  Status: ${mentorship.status}`);
      console.log(`  Start Date: ${mentorship.startDate}`);
      console.log(`  End Date: ${mentorship.endDate}`);
    });
    
    // Get all mentorship sessions
    const sessions = await prisma.mentorshipSession.findMany({
      include: {
        mentorship: {
          include: {
            mentor: {
              select: {
                fullName: true
              }
            },
            mentee: {
              select: {
                fullName: true
              }
            }
          }
        }
      }
    });
    
    console.log('\nTotal mentorship sessions:', sessions.length);
    sessions.forEach(session => {
      console.log(`- Mentor: ${session.mentorship.mentor.fullName}`);
      console.log(`  Mentee: ${session.mentorship.mentee.fullName}`);
      console.log(`  Topic: ${session.topic}`);
      console.log(`  Scheduled: ${session.scheduledAt}`);
      console.log(`  Duration: ${session.duration} minutes`);
      console.log(`  Status: ${session.status}`);
    });
    
    // Get all users with their roles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true
      }
    });
    
    console.log('\nAll users:');
    users.forEach(user => {
      console.log(`- ${user.fullName} (${user.id}): ${user.email}`);
    });
    
  } catch (error) {
    console.error('Error checking mentorship data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMentorshipData();