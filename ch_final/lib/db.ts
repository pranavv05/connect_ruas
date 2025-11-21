import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

declare global {
  // allow global var in dev to prevent multiple clients
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined
}

const getPrisma = async (): Promise<PrismaClient> => {
  // Check if we have Turso database credentials
  const tursoDatabaseUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  // Use Turso if credentials are provided
  if (tursoDatabaseUrl && tursoAuthToken) {
    try {
      const libsql = createClient({
        url: tursoDatabaseUrl,
        authToken: tursoAuthToken,
      });
      
      const adapter = new PrismaLibSQL(libsql);
      return new PrismaClient({ adapter });
    } catch (error) {
      console.error('Failed to initialize Turso client:', error);
      throw error;
    }
  }

  // Fallback to local SQLite
  return new PrismaClient();
}

// Create a singleton instance
let prismaClient: PrismaClient | undefined;

export const getPrismaClient = async (): Promise<PrismaClient> => {
  if (!prismaClient) {
    prismaClient = await getPrisma();
  }
  return prismaClient;
}

export default getPrismaClient