import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// FIX: bcryptjs functions are usually default exports in ES Modules
import bcrypt from 'bcryptjs';
const { genSalt, hash, compare } = bcrypt; 
import { generateToken } from '../utils/authUtils.js';

// --- C: Create (Registration) ---
export const registerUser = async (req, res, next) => { // FIX: Added export keyword
    const { email, password, name, role } = req.body;

    try {
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            // Using a simple error to be caught by the ErrorHandler
            const error = new Error('User already exists');
            error.statusCode = 400; // Define a status code for the handler
            return next(error); 
        }

        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

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
export const authUser = async (req, res, next) => { // FIX: Added export keyword
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        // NOTE: We need to use user.password because the findUnique query returns the hash
        if (user && (await compare(password, user.password))) {
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

// No default export needed when using named exports
// export default { registerUser, authUser }; 
