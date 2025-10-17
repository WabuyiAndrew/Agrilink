import { Router } from 'express';
const router = Router();
// Changed: Point authentication to authController
import { registerUser, authUser } from '../controllers/authController.js'; 
import { getUserProfile, updateProfile, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// --- C: Create (Registration) & R: Read (Authentication) ---
// Changed: Use authController for register and login
router.post('/register', registerUser);
router.post('/login', authUser);

// --- R, U, D (Profile Management) ---
router.get('/profile', protect, getUserProfile); 
router.put('/profile', protect, updateProfile);
// ✅PATCH for semantically correct partial updates
router.patch('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteUser);

// --- Admin Utility: Get All Users ---
// GET /api/users
// Requires authentication (protect) AND the 'admin' role (authorize('admin'))
// FIX: We need an actual controller function to fetch all users (Placeholder for now)
router.get('/', protect, authorize(['admin']), (req, res) => {
    // NOTE: This is where you would call a controller function like getAllUsers
    res.json({ message: 'Admin access only: Placeholder for fetching all users.' });
});

export default router;
