// backend/controllers/authController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/authUtils');

// --- C: Create (Registration) ---
const registerUser = async (req, res, next) => {
    const { email, password, name, role } = req.body;

    try {
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            // Using a simple error to be caught by the ErrorHandler
            const error = new Error('User already exists');
            error.statusCode = 400; // Define a status code for the handler
            return next(error); 
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                // Default to 'farmer', or use 'admin' if requested and allowed (needs more logic)
                role: role && role.toLowerCase() !== 'admin' ? role : 'farmer', 
            },
            select: { id: true, email: true, role: true, name: true, createdAt: true }
        });

        res.status(201).json({
            ...user,
            token: generateToken(user),
        });
        
    } catch (error) {
        // Pass any unexpected errors to the Error Handler
        next(error);
    }
};

// --- R: Read (Authentication / Login) ---
const authUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() },
            });
            
            res.json({
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                token: generateToken(user),
            });
        } else {
            const error = new Error('Invalid email or password');
            error.statusCode = 401; 
            return next(error);
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    registerUser, 
    authUser 
};