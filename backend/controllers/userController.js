// backend/controllers/userController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// NOTE: registerUser and authUser have been moved to authController.js

// --- R: Read (Profile) ---

// @route GET /api/users/profile
const getUserProfile = async (req, res, next) => {
    // req.user is available from the 'protect' middleware and contains { id, email, role }
    const userId = req.user.id; 
    
    try {
        const user = await prisma.user.findUnique({ 
            where: { id: userId },
            // Fetch User details along with their optional UserProfile
            include: { profile: true } 
        });

        if (user) {
            // Destructure to safely remove the password hash before sending
            const { password, ...userData } = user;
            res.json(userData);
        } else {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }
    } catch (error) {
        next(error); // Pass error to the error handler
    }
};


// --- U: Update ---

// @route PUT /api/users/profile
const updateProfile = async (req, res, next) => {
    const userId = req.user.id;
    const { name, phone, farmName, region, district, description, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            return next(error);
        }
        
        // 1. Handle Password Update (Optional)
        let hashedPassword = user.password; // Default to current hash
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // 2. Update User (Core fields)
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                // Use the new value if provided, otherwise keep the current value
                name: name !== undefined ? name : user.name,
                phone: phone !== undefined ? phone : user.phone,
                password: hashedPassword,
            },
        });

        // 3. Update or Create UserProfile (Related fields)
        const updatedProfile = await prisma.userProfile.upsert({
            where: { userId: userId },
            update: {
                farmName: farmName,
                region: region,
                district: district,
                description: description,
                // Simple check for completeness based on core profile fields
                profileComplete: Boolean(farmName && region && district),
            },
            create: {
                userId: userId,
                farmName: farmName,
                region: region,
                district: district,
                description: description,
                profileComplete: Boolean(farmName && region && district),
            }
        });

        // Respond with updated data (excluding password)
        const { password: removedPassword, ...userData } = updatedUser;
        res.json({ 
            user: userData,
            profile: updatedProfile,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        next(error); // Pass error to the error handler
    }
};

// --- D: Delete ---

// @route DELETE /api/users/profile
const deleteUser = async (req, res, next) => {
    const userId = req.user.id;
    
    try {
        // 1. Delete dependent records first (UserProfile)
        await prisma.userProfile.deleteMany({ where: { userId } });
        
        // 2. Delete the User record
        await prisma.user.delete({ where: { id: userId } });

        res.status(200).json({ message: 'User account and profile successfully deleted' });
        
    } catch (error) {
        next(error); // Pass error to the error handler
    }
};

module.exports = { 
    getUserProfile,
    updateProfile,
    deleteUser
};