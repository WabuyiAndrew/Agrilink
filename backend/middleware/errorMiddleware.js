/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// backend/src/middleware/errorMiddleware.js

/**
 * Global Error Handler Middleware.
 * Catches errors passed via next(error) from controllers or other middleware.
 * @param {Error} err - The error object passed from next(error).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} _next - Express next middleware function (unused, but required by signature).
 */
export const errorHandler = (err, req, res, _next) => {
    // Determine the final status code:
    // 1. Use the status already set on the response object (if not default 200).
    // 2. Otherwise, use the status code attached to the error object (if present).
    // 3. Default to 500 (Internal Server Error).
    const statusCode = res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);
    
    // Determine the message: use the error's message or a generic message.
    const message = err.message || 'Something went wrong';
    
    // --- CONDITIONAL LOGGING FOR TESTING ---
    const isTestEnvironment = process.env.NODE_ENV === 'test';
    const isExpectedAuthError = statusCode === 401; 

    if (isTestEnvironment && isExpectedAuthError) {
        // If we're testing AND it's a 401, we know the test expects this, 
        // so we skip the aggressive console.error to keep the test output clean.
        console.log(`[TEST - ${statusCode}] Suppressing log for expected error: ${message}`);
    } else {
        // Log all other errors (actual failures, or errors during development/production)
        console.error(`Error [${statusCode}]: ${message}`, err.stack);
    }

    // Send a structured JSON response back to the client
    res.status(statusCode).json({
        message: message,
        // Only include the stack trace if not in production mode for security
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
