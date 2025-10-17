import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// FIX: bcryptjs is often a default export in ES Modules
import bcrypt from 'bcryptjs';
const { genSalt, hash } = bcrypt;

// NOTE: registerUser and authUser have been moved to authController.js

// --- R: Read (Profile) ---

// @route GET /api/users/profile
export const getUserProfile = async (req, res, next) => { // FIX: Added export
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
            // eslint-disable-next-line no-unused-vars
            const { password, ...userData } = user; // Ensure password is excluded
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
export const updateProfile = async (req, res, next) => { // FIX: Added export
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
            const salt = await genSalt(10);
            hashedPassword = await hash(password, salt);
        }

        // 2. Update User (Core fields)
        // Only update if the field is explicitly provided in the request body
        const userDataToUpdate = {
            name: name !== undefined ? name : user.name,
            phone: phone !== undefined ? phone : user.phone,
            password: hashedPassword,
        };

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: userDataToUpdate,
        });

        // 3. Update or Create UserProfile (Related fields)
        // Use logic to check if fields are provided for the profile update
        const profileDataToUpdate = {
            farmName: farmName,
            region: region,
            district: district,
            description: description,
            profileComplete: Boolean(farmName && region && district),
        };

        const updatedProfile = await prisma.userProfile.upsert({
            where: { userId: userId },
            update: profileDataToUpdate,
            create: {
                userId: userId,
                ...profileDataToUpdate
            }
        });

        // Respond with updated data (excluding password)
        // eslint-disable-next-line no-unused-vars
        const { password: userPassword, ...userData } = updatedUser; // Ensure password is excluded
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
export const deleteUser = async (req, res, next) => { // FIX: Added export
    const userId = req.user.id;
    
    try {
        // 1. Delete dependent records first (UserProfile)
        // NOTE: This assumes UserProfile has a foreign key constraint 'onDelete: Cascade' in the schema.
        // If not, deleteMany is required to prevent constraint errors.
        await prisma.userProfile.deleteMany({ where: { userId } });
        
        // 2. Delete the User record
        await prisma.user.delete({ where: { id: userId } });

        res.status(200).json({ message: 'User account and profile successfully deleted' });
        
    } catch (error) {
        next(error); // Pass error to the error handler
    }
};

// Removed export default { ... }
