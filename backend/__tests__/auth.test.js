// backend/__tests__/auth.test.js (CORRECTED)

const request = require('supertest');
// NOTE: Ensure your path is correct (it should likely be '../server')
// If your server file is named 'server.js', use:
const app = require('../app'); 

// Note: For real integration tests, you MUST use a separate TEST database.
// For this simple test, we assume the server starts correctly.

describe('Authentication Endpoints', () => {
    
    // Test Case 1: Check if the base route is working
    it('GET / should respond with success message', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Agrilink API is running');
    });

    // Test Case 2: Ensure a protected route returns 401 without a token
    it('GET /api/users/profile should fail with 401 without token', async () => {
        const response = await request(app)
            .get('/api/users/profile')
            .send(); // No body needed
            
        expect(response.statusCode).toBe(401);
        // FIX: Change expected message to match what the middleware returns:
        expect(response.body.message).toBe('Not authorized, no token'); 
    });

    // NOTE: Full CRUD tests (register, login, etc.) require mocking or a test DB setup.
});