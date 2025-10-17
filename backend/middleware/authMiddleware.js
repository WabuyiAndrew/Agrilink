<<<<<<< HEAD
/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
=======
// backend/middleware/authMiddleware.js (Complete & Correct)

const jwt = require('jsonwebtoken');
>>>>>>> 466a55244efea02df24c09d2b2bfeb29f33b4656
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to verify a JWT and attach user data to the request (req.user).
 */
<<<<<<< HEAD
export const protect = (req, res, next) => {
=======
const protect = (req, res, next) => {
>>>>>>> 466a55244efea02df24c09d2b2bfeb29f33b4656
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
<<<<<<< HEAD
            // Use jwt.verify()
=======
>>>>>>> 466a55244efea02df24c09d2b2bfeb29f33b4656
            const decoded = jwt.verify(token, JWT_SECRET);
            
            req.user = decoded; 
            
            next();
<<<<<<< HEAD
        // eslint-disable-next-line no-unused-vars
=======
>>>>>>> 466a55244efea02df24c09d2b2bfeb29f33b4656
        } catch (error) {
            // Error when token is invalid or expired
            const authError = new Error('Not authorized, token failed');
            authError.statusCode = 401;
            return next(authError);
        }
    } else {
        // No Authorization header found
        const noTokenError = new Error('Not authorized, no token'); 
        noTokenError.statusCode = 401;
        return next(noTokenError);
    }
<<<<<<< HEAD
=======
    // NOTE: This version relies on the 'else' block, so no final 'if (!token)' check is needed.
>>>>>>> 466a55244efea02df24c09d2b2bfeb29f33b4656
};

/**
 * Middleware to check if the user has a specific role (e.g., 'admin', 'farmer').
 */
<<<<<<< HEAD
export const authorize = (roles = []) => {
=======
const authorize = (roles = []) => { // <-- THIS FUNCTION MUST BE DEFINED HERE
>>>>>>> 466a55244efea02df24c09d2b2bfeb29f33b4656
    return (req, res, next) => {
        // Ensure roles is an array
        if (typeof roles === 'string') {
            roles = [roles];
        }
        
        // Check if user object and role are present from the protect middleware
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Access denied: Authentication missing role info' });
        }

        // Check if the user's role is in the list of allowed roles
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied: Role ${req.user.role} is not permitted` });
        }
        
        next();
    };
};

<<<<<<< HEAD
// Removed default export. Using named exports above.
// export default { protect, authorize };
=======
module.exports = { protect, authorize }; // <-- BOTH functions must be in scope here
>>>>>>> 466a55244efea02df24c09d2b2bfeb29f33b4656
