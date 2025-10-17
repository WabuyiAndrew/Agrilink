const request = require('supertest');
const app = require('../app'); // <--- FIX: Changed '../server' to '../app'
const { PrismaClient } = require('@prisma/client');

// NOTE: We assume the Jest setup has configured PrismaClient 
// to use the 'agrilink_test' database via NODE_ENV=test and .env.test.
const prisma = new PrismaClient();

// Data fixture for testing
const testUser = {
    email: 'test_crud_user_final@agri.com',
    password: 'SecurePass123',
    name: 'Test CRUD User',
    role: 'farmer' // Using 'farmer' to potentially test authorization later
};

// Variables to store dynamic data across tests
let authToken;
let createdUserId; 

describe('USER FULL CRUD LIFECYCLE', () => {
    
    // Clean up the user after the entire test suite runs, just in case a test failed mid-way
    afterAll(async () => {
        // This is a failsafe; the DELETE test handles primary cleanup.
        await prisma.user.deleteMany({ where: { email: testUser.email } });
    });


    // 1. C: Register User (Creation)
    it('POST /api/users/register should create a new user and return a token (201)', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toBe(testUser.email);
        
        authToken = res.body.token; 
        
        // Verify user exists in the database and capture ID
        const dbUser = await prisma.user.findUnique({ where: { email: testUser.email } });
        expect(dbUser).not.toBeNull();
        createdUserId = dbUser.id; // Store ID for potential later checks
    });

    // 2. R: Login User (Authentication check)
    it('POST /api/users/login should log the user in and return a new token (200)', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: testUser.email, password: testUser.password });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        authToken = res.body.token; 
    });
    
    // 3. R: Get Profile (Protected Read operation)
    it('GET /api/users/profile should return user data with a valid token (200)', async () => {
        const res = await request(app)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${authToken}`); 

        expect(res.statusCode).toBe(200);
        // FIX: Expecting the user object to be directly in the response body (res.body.email)
        // instead of nested under a 'user' key (res.body.user.email)
        expect(res.body.email).toBe(testUser.email);
        expect(res.body).not.toHaveProperty('password'); 
    });

    // 4. U: Update Profile (Update operation)
    it('PATCH /api/users/profile should update user data (200)', async () => {
        const newName = 'Updated Test Name';
        const res = await request(app)
            .patch('/api/users/profile')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ name: newName }); // Patch only the name

        expect(res.statusCode).toBe(200);
        // FIX: Assuming the server returns a success message object instead of the full user resource.
        // We rely on the subsequent DB check to confirm the update occurred.
        expect(res.body).toHaveProperty('message'); 
        
        // Optional: Verify update persisted in the database
        const dbUser = await prisma.user.findUnique({ where: { id: createdUserId } });
        expect(dbUser.name).toBe(newName);
    });
    
    // 5. D: Delete User (Destruction)
    it('DELETE /api/users/profile should delete the user account (200)', async () => {
        const res = await request(app)
            .delete('/api/users/profile')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('User account and profile successfully deleted');

        // Final verification: The user should be gone from the database
        const dbUser = await prisma.user.findUnique({ where: { id: createdUserId } });
        expect(dbUser).toBeNull();
    });
});
