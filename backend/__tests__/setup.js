<<<<<<< HEAD
/* eslint-disable no-undef */
// backend/__tests__/setup.js

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' });

=======
// backend/__tests__/setup.js

// This ensures .env.test is loaded for all setup/teardown logic
require('dotenv').config({ path: '.env.test' }); 

const { PrismaClient } = require('@prisma/client');
>>>>>>> 466a55244efea02df24c09d2b2bfeb29f33b4656
const prisma = new PrismaClient();

// The afterAll hook runs once all test files have finished
afterAll(async () => {
<<<<<<< HEAD
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
=======
    try {
        // The safest way to clean is to manually delete data in the correct order
        // (to avoid foreign key constraint errors)
        await prisma.user.deleteMany({});
        // await prisma.listing.deleteMany({}); // Add this once Listing model is active

    } catch (error) {
        console.error('Error cleaning up test database:', error);
    } finally {
        await prisma.$disconnect();
    }
});
>>>>>>> 466a55244efea02df24c09d2b2bfeb29f33b4656
