require('dotenv').config();
const { createClerkClient } = require('@clerk/backend');

// Use the same database connection logic as the application
let prisma;

async function initPrisma() {
  // Check if we have Turso database credentials
  const tursoDatabaseUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  // Use Turso if credentials are provided
  if (tursoDatabaseUrl && tursoAuthToken) {
    try {
      const { createClient } = await import('@libsql/client');
      const { PrismaLibSQL } = require('@prisma/adapter-libsql');
      
      const client = createClient({
        url: tursoDatabaseUrl,
        authToken: tursoAuthToken,
      });
      
      const adapter = new PrismaLibSQL({
        url: tursoDatabaseUrl,
        authToken: tursoAuthToken,
      });
      
      const { PrismaClient } = require('@prisma/client');
      return new PrismaClient({ adapter });
    } catch (error) {
      console.error('Failed to initialize Turso client:', error);
      throw error;
    }
  }

  // Fallback to local SQLite
  const { PrismaClient } = require('@prisma/client');
  return new PrismaClient();
}

async function getPrismaClient() {
  if (!prisma) {
    prisma = await initPrisma();
  }
  return prisma;
}

// Initialize Clerk client with secret key
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function syncAllClerkUsers() {
  console.log('Starting sync of all Clerk users to database...');
  
  try {
    let totalUsersSynced = 0;
    let totalUsersInClerk = 0;
    let offset = 0;
    const limit = 100; // Process 100 users at a time
    
    // Keep fetching users until we have them all
    while (true) {
      console.log(`Fetching Clerk users (offset: ${offset}, limit: ${limit})...`);
      
      // Fetch users from Clerk
      // Initialize Prisma client
      const prisma = await getPrismaClient();
      
      const clerkUsersResponse = await clerkClient.users.getUserList({
        limit,
        offset,
      });
      
      const clerkUsers = clerkUsersResponse.data;
      totalUsersInClerk = clerkUsersResponse.totalCount;
      
      console.log(`Fetched ${clerkUsers.length} users from Clerk (total: ${totalUsersInClerk})`);
      
      // If no more users, break
      if (clerkUsers.length === 0) {
        break;
      }
      
      // Process each user
      for (const clerkUser of clerkUsers) {
        try {
          // Extract real data from Clerk user
          const userId = clerkUser.id;
          const primaryEmail = clerkUser.emailAddresses.find(
            email => email.id === clerkUser.primaryEmailAddressId
          )?.emailAddress || `${userId}@example.com`;
          
          const fullName = clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.firstName || clerkUser.lastName || 'User';
          
          // Initialize Prisma client for each user (to avoid connection issues)
          const prisma = await getPrismaClient();
          
          // Check if user already exists in our database
          const existingUser = await prisma.user.findUnique({
            where: { id: userId }
          });
          
          if (existingUser) {
            // Update existing user with real data if they have placeholder data
            const hasPlaceholderEmail = existingUser.email.endsWith('@example.com');
            const hasGenericName = 
              existingUser.fullName === 'Project Creator' || 
              existingUser.fullName === 'Project Member' || 
              existingUser.fullName === 'User' ||
              existingUser.fullName.startsWith('User-') ||
              existingUser.fullName.startsWith('user_') ||
              (existingUser.fullName.includes('User ') && existingUser.fullName.length < 20) ||
              (existingUser.fullName.includes('user_') && existingUser.fullName.length > 20);
            
            // If user has placeholder data, update them with real data
            if (hasPlaceholderEmail || hasGenericName || primaryEmail !== existingUser.email || fullName !== existingUser.fullName) {
              const updateData = {};
              
              if (hasPlaceholderEmail || primaryEmail !== existingUser.email) {
                updateData.email = primaryEmail;
              }
              
              if (hasGenericName || fullName !== existingUser.fullName) {
                updateData.fullName = fullName;
              }
              
              if (Object.keys(updateData).length > 0) {
                await prisma.user.update({
                  where: { id: userId },
                  data: updateData
                });
                
                console.log(`✅ Updated user ${userId} with real data: ${primaryEmail} (${fullName})`);
                totalUsersSynced++;
              }
            } else {
              console.log(`⏭️  User ${userId} already has real data, skipping...`);
            }
          } else {
            // Create new user with real data
            // Generate a unique username based on actual email if possible
            let username = primaryEmail.split('@')[0] || `user_${userId.substring(0, 8)}`;
            let userExists = await prisma.user.findUnique({
              where: { username: username }
            });
            
            // If username exists, append a timestamp to make it unique
            if (userExists) {
              username = `user_${userId.substring(0, 8)}_${Date.now()}`;
            }
            
            await prisma.user.create({
              data: {
                id: userId,
                email: primaryEmail,
                username: username,
                fullName: fullName,
              },
            });
            
            console.log(`🆕 Created user ${userId} with real data: ${primaryEmail} (${fullName})`);
            totalUsersSynced++;
          }
        } catch (error) {
          console.error(`❌ Error processing user ${clerkUser.id}:`, error);
        }
      }
      
      // If we've processed all users, break
      if (clerkUsers.length < limit) {
        break;
      }
      
      // Move to next batch
      offset += limit;
    }
    
    console.log(`\n🎉 Sync completed!`);
    console.log(`📊 Total users in Clerk: ${totalUsersInClerk}`);
    console.log(`💾 Users synced/updated in database: ${totalUsersSynced}`);
    
  } catch (error) {
    console.error('❌ Error during user sync:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the sync
syncAllClerkUsers()
  .then(() => {
    console.log('\n✨ User sync script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 User sync script failed with error:', error);
    process.exit(1);
  });