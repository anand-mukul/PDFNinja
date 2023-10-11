import { PrismaClient } from '@prisma/client';

// Declare the global variable for cached Prisma instance
declare global {
  var cachedPrisma: PrismaClient;
}

// Check if Prisma instance exists, if not, create a new instance
let prisma: PrismaClient;

// Use a cached Prisma instance in development, create a new instance in production
if (process.env.NODE_ENV === 'production') {
  // Create a new Prisma instance in production
  prisma = new PrismaClient();
} else {
  // Use a cached Prisma instance in development if available, otherwise, create and cache a new instance
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  // Use the cached Prisma instance
  prisma = global.cachedPrisma;
}

// Export the Prisma instance for database operations
export const db = prisma;
