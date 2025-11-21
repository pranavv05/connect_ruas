const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function populateMentorshipData() {
  try {
    console.log('Populating mentorship data...');
    
    // Check if mentorships already exist
    const existingMentorships = await prisma.$queryRaw`SELECT COUNT(*) as count FROM mentorships`;
    console.log('Existing mentorships:', existingMentorships[0].count);
    
    if (existingMentorships[0].count > 0) {
      console.log('Mentorship data already exists, skipping...');
      return;
    }
    
    // Create mentorship relationships using raw SQL
    // Make Alice Johnson (0341de5a-db1c-4275-a9e4-ccfd8cba80bf) a mentor to Bob Smith (8e6a2689-f73b-4809-9c88-8f1554903e0f)
    await prisma.$executeRaw`
      INSERT INTO mentorships (id, mentor_id, mentee_id, status, start_date, created_at, updated_at)
      VALUES ('mentorship-1', '0341de5a-db1c-4275-a9e4-ccfd8cba80bf', '8e6a2689-f73b-4809-9c88-8f1554903e0f', 'accepted', ${new Date()}, ${new Date()}, ${new Date()})
      ON CONFLICT (mentor_id, mentee_id) DO UPDATE SET status = 'accepted', start_date = ${new Date()}, updated_at = ${new Date()}
    `;
    
    console.log('Created/updated mentorship 1');
    
    // Make Bob Smith (8e6a2689-f73b-4809-9c88-8f1554903e0f) a mentor to Charlie Brown (6d0fd9ff-52e6-4787-8347-db1c26ad3ff3)
    await prisma.$executeRaw`
      INSERT INTO mentorships (id, mentor_id, mentee_id, status, start_date, created_at, updated_at)
      VALUES ('mentorship-2', '8e6a2689-f73b-4809-9c88-8f1554903e0f', '6d0fd9ff-52e6-4787-8347-db1c26ad3ff3', 'accepted', ${new Date()}, ${new Date()}, ${new Date()})
      ON CONFLICT (mentor_id, mentee_id) DO UPDATE SET status = 'accepted', start_date = ${new Date()}, updated_at = ${new Date()}
    `;
    
    console.log('Created/updated mentorship 2');
    
    // Create some mentorship sessions
    await prisma.$executeRaw`
      INSERT INTO mentorship_sessions (id, mentorship_id, scheduled_at, duration, topic, status, created_at, updated_at)
      VALUES ('session-1', 'mentorship-1', ${new Date(Date.now() + 24 * 60 * 60 * 1000)}, 60, 'React Performance Optimization', 'scheduled', ${new Date()}, ${new Date()})
      ON CONFLICT (id) DO NOTHING
    `;
    
    console.log('Created session 1');
    
    await prisma.$executeRaw`
      INSERT INTO mentorship_sessions (id, mentorship_id, scheduled_at, duration, topic, status, created_at, updated_at)
      VALUES ('session-2', 'mentorship-1', ${new Date(Date.now() + 48 * 60 * 60 * 1000)}, 45, 'State Management Patterns', 'scheduled', ${new Date()}, ${new Date()})
      ON CONFLICT (id) DO NOTHING
    `;
    
    console.log('Created session 2');
    
    await prisma.$executeRaw`
      INSERT INTO mentorship_sessions (id, mentorship_id, scheduled_at, duration, topic, status, created_at, updated_at)
      VALUES ('session-3', 'mentorship-2', ${new Date(Date.now() + 72 * 60 * 60 * 1000)}, 30, 'Product Roadmap Planning', 'scheduled', ${new Date()}, ${new Date()})
      ON CONFLICT (id) DO NOTHING
    `;
    
    console.log('Created session 3');
    
    console.log('Mentorship data populated successfully!');
  } catch (error) {
    console.error('Error populating mentorship data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateMentorshipData();