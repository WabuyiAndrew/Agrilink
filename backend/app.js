// backend/server.js

// 1. IMPORT DOTENV AND CALL IT'S CONFIG METHOD
// We need to store the return value of require('dotenv') to use it later.
const dotenv = require('dotenv');

// Load .env.test if NODE_ENV is 'test', otherwise load default .env
const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envPath }); // <-- Now dotenv is defined!

const express = require('express');
const { PrismaClient } = require('@prisma/client');

// Import Middleware
const { errorHandler } = require('./middleware/errorMiddleware');

// Import Routes
const userRoutes = require('./routes/userRoutes');
// const listingRoutes = require('./src/routes/listingRoutes');
// const forumRoutes = require('./src/routes/forumRoutes');

// --- 1. APPLICATION DEFINITION ---
// Initialize Express App
const app = express();
// NOTE: process.env.PORT is now guaranteed to be loaded from the correct .env file
const port = process.env.PORT || 5010; 

// Initialize Prisma Client
const prisma = new PrismaClient(); 

// General Middleware
app.use(express.json()); 

// Dependency Injection (Attaching prisma)
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.send('✅ Agrilink API is running!');
});
app.use('/api/users', userRoutes);
// app.use('/api/listings', listingRoutes);
// app.use('/api/forum', forumRoutes);

// ⚠️ ERROR HANDLER MUST BE THE LAST PIECE OF MIDDLEWARE
app.use(errorHandler);

// --- 2. EXPORT AND LISTENER SEPARATION ---

// Export the raw Express app object for Supertest
module.exports = app; 

// Start the server ONLY if the file is executed directly (not imported by a test runner)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`🚀 Server listening on port ${port} (http://localhost:${port})`);
    });
}