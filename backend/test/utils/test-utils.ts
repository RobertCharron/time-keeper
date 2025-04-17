import { PrismaClient } from '../../generated/prisma';

// Initialize PrismaClient with test environment
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/timekeeper_test',
    },
  },
});

export async function cleanupDatabase() {
  const tablenames = ['User', 'Station', 'Activity', 'ActivityUse'];
  
  for (const tablename of tablenames) {
    try {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${tablename}" CASCADE;`
      );
    } catch (error) {
      console.error(`Error truncating ${tablename}:`, error);
    }
  }
}

export async function createTestUser() {
  return prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      hashedPassword: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm' // "password123"
    }
  });
}