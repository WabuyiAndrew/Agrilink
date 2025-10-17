/* eslint-disable no-undef */
// backend/app.js  (or server.js if you prefer)

import dotenv from 'dotenv';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';

// Load .env.test if NODE_ENV is 'test', otherwise load default .env
const envPath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envPath });

// --- 1. APPLICATION DEFINITION ---
const app = express();
const port = process.env.PORT || 5010;
const prisma = new PrismaClient();

// General Middleware
app.use(express.json());

// Dependency Injection (Attaching prisma to req)
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('✅ Agrilink API is running!');
});

app.use('/api/users', userRoutes);

// Error Handler (always last)
app.use(errorHandler);

// --- 2. EXPORT AND SERVER START SEPARATION ---
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port} (http://localhost:${port})`);
  });
}

// ✅ Export the app for testing
export default app;
