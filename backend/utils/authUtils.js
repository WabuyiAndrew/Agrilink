/* eslint-disable no-undef */
import jwt from 'jsonwebtoken'; // FIX: Changed named import to default import

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Generates a JWT for a user.
 * @param {object} user - The user object containing id, email, and role.
 * @returns {string} The generated JWT.
 */
// FIX: Changed to a NAMED EXPORT to match how it is imported in authController.js
export function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    const options = {
        expiresIn: '7d' 
    };

    // FIX: Accessing the sign function via the imported 'jwt' object
    return jwt.sign(payload, JWT_SECRET, options);
}
