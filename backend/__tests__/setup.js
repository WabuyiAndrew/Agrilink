// backend/__tests__/setup.js

// This ensures .env.test is loaded for all setup/teardown logic
require('dotenv').config({ path: '.env.test' }); 

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// The afterAll hook runs once all test files have finished
afterAll(async () => {
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