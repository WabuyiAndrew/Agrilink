const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Generates a JWT for a user.
 */
function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    const options = {
        expiresIn: '7d' 
    };

    return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = { generateToken };