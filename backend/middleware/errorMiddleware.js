// backend/src/middleware/errorMiddleware.js

/**
 * Global Error Handler Middleware.
 * Catches errors passed via next(error) from controllers or other middleware.
 */
const errorHandler = (err, req, res, next) => {
    // Determine the status code: use the error's code or default to 500 (Server Error)
    const statusCode = err.statusCode || 500;
    
    // Determine the message: use the error's message
    const message = err.message || 'Something went wrong';
    
    // Log the error for debugging (optional, but highly recommended)
    console.error(`Error [${statusCode}]: ${message}`);

    // Send a structured JSON response back to the client
    res.status(statusCode).json({
        message: message,
        // Only include the stack trace in development mode for security
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };