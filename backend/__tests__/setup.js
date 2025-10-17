/* eslint-disable no-undef */
// backend/__tests__/setup.js

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' });

const prisma = new PrismaClient();

// The afterAll hook runs once all test files have finished
afterAll(async () => {
  try {
    // Clean up test data safely
    await prisma.user.deleteMany({});
    // await prisma.listing.deleteMany({}); // Uncomment if you add Listing model later
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  } finally {
    await prisma.$disconnect();
  }
});

export { prisma };
