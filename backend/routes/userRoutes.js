const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    getUsers,
    getUserById,
    activateUser,
    deactivateUser,
    updateUserStatus,
    deleteUser,
    getProfile,
    updateProfile,
    changePassword,
    getUserCount
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// ==================== PUBLIC ROUTES ====================

// Get total user count
router.route('/count')
    .get(getUserCount);

// ==================== USER ROUTES ====================

// View own profile
router.route('/profile')
    .get(protect, getProfile);

// Update profile (fullName and email)
router.route('/update-profile')
    .put(protect, [
        check('fullName')
            .optional()
            .not().isEmpty().withMessage('Full name cannot be empty')
            .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
        check('email', 'Please include a valid email address').optional().isEmail()
    ], updateProfile);

// Change password route
router.route('/change-password')
    .put(protect, [
        check('newPassword')
            .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
            .matches(/\d/).withMessage('New password must contain at least one number')
    ], changePassword);

// ==================== ADMIN ROUTES ====================

// Admin routes - Get all users
router.route('/')
    .get(protect, admin, getUsers);

// Admin routes - Get, Delete single user
router.route('/:id')
    .get(protect, admin, getUserById)
    .delete(protect, admin, deleteUser);

// Admin routes - Update user status (generic)
router.route('/:id/status')
    .put(protect, admin, updateUserStatus);

// Admin routes - Activate user
router.route('/:id/activate')
    .put(protect, admin, activateUser);

// Admin routes - Deactivate user
router.route('/:id/deactivate')
    .put(protect, admin, deactivateUser);

module.exports = router;

