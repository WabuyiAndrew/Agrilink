/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to verify a JWT and attach user data to the request (req.user).
 */
export const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // Use jwt.verify()
            const decoded = jwt.verify(token, JWT_SECRET);
            
            req.user = decoded; 
            
            next();
        // eslint-disable-next-line no-unused-vars
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
};

/**
 * Middleware to check if the user has a specific role (e.g., 'admin', 'farmer').
 */
export const authorize = (roles = []) => {
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

// Removed default export. Using named exports above.
// export default { protect, authorize };
