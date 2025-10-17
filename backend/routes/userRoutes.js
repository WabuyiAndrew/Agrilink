// backend/src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
// Changed: Point authentication to authController
const authController = require('../controllers/authController'); 
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// --- C: Create (Registration) & R: Read (Authentication) ---
// Changed: Use authController for register and login
router.post('/register', authController.registerUser);
router.post('/login', authController.authUser);

// --- R, U, D (Profile Management) ---
router.get('/profile', protect, userController.getUserProfile); 
router.put('/profile', protect, userController.updateProfile);
// ✅PATCH for semantically correct partial updates
router.patch('/profile', protect, userController.updateProfile);
router.delete('/profile', protect, userController.deleteUser);

// --- Admin Utility (Example) ---
router.get('/', protect, authorize('admin'), (req, res) => {
    res.json({ message: 'Admin access only: Get all users placeholder' });
});

module.exports = router;