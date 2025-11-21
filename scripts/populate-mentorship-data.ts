import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function populateMentorshipData() {
  try {
    console.log('Populating mentorship data...');
    
    // Get all users
    const users = await prisma.user.findMany();
    
    if (users.length < 2) {
      console.log('Not enough users to create mentorship relationships');
      return;
    }
    
    // Create mentorship relationships
    // Make Alice Johnson (0341de5a-db1c-4275-a9e4-ccfd8cba80bf) a mentor to Bob Smith (8e6a2689-f73b-4809-9c88-8f1554903e0f)
    const mentorship1 = await prisma.Mentorship.upsert({
      where: {
        mentorId_menteeId: {
          mentorId: '0341de5a-db1c-4275-a9e4-ccfd8cba80bf',
          menteeId: '8e6a2689-f73b-4809-9c88-8f1554903e0f'
        }
      },
      update: {
        status: 'accepted',
        startDate: new Date()
      },
      create: {
        mentorId: '0341de5a-db1c-4275-a9e4-ccfd8cba80bf',
        menteeId: '8e6a2689-f73b-4809-9c88-8f1554903e0f',
        status: 'accepted',
        startDate: new Date()
      }
    });
    
    console.log('Created/updated mentorship 1:', mentorship1.id);
    
    // Make Bob Smith (8e6a2689-f73b-4809-9c88-8f1554903e0f) a mentor to Charlie Brown (6d0fd9ff-52e6-4787-8347-db1c26ad3ff3)
    const mentorship2 = await prisma.Mentorship.upsert({
      where: {
        mentorId_menteeId: {
          mentorId: '8e6a2689-f73b-4809-9c88-8f1554903e0f',
          menteeId: '6d0fd9ff-52e6-4787-8347-db1c26ad3ff3'
        }
      },
      update: {
        status: 'accepted',
        startDate: new Date()
      },
      create: {
        mentorId: '8e6a2689-f73b-4809-9c88-8f1554903e0f',
        menteeId: '6d0fd9ff-52e6-4787-8347-db1c26ad3ff3',
        status: 'accepted',
        startDate: new Date()
      }
    });
    
    console.log('Created/updated mentorship 2:', mentorship2.id);
    
    // Create some mentorship sessions
    const session1 = await prisma.MentorshipSession.upsert({
      where: {
        id: 'session-1'
      },
      update: {},
      create: {
        id: 'session-1',
        mentorshipId: mentorship1.id,
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        duration: 60,
        topic: 'React Performance Optimization',
        status: 'scheduled'
      }
    });
    
    console.log('Created session 1:', session1.id);
    
    const session2 = await prisma.MentorshipSession.upsert({
      where: {
        id: 'session-2'
      },
      update: {},
      create: {
        id: 'session-2',
        mentorshipId: mentorship1.id,
        scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // In 2 days
        duration: 45,
        topic: 'State Management Patterns',
        status: 'scheduled'
      }
    });
    
    console.log('Created session 2:', session2.id);
    
    const session3 = await prisma.MentorshipSession.upsert({
      where: {
        id: 'session-3'
      },
      update: {},
      create: {
        id: 'session-3',
        mentorshipId: mentorship2.id,
        scheduledAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // In 3 days
        duration: 30,
        topic: 'Product Roadmap Planning',
        status: 'scheduled'
      }
    });
    
    console.log('Created session 3:', session3.id);
    
    console.log('Mentorship data populated successfully!');
  } catch (error) {
    console.error('Error populating mentorship data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateMentorshipData();