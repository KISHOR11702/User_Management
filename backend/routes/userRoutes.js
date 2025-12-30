const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    activateUser,
    deactivateUser,
    updateUserStatus,
    deleteUser,
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// ==================== USER ROUTES ====================

// View own profile
router.route('/profile')
    .get(protect, getProfile);

// Update profile (fullName and email)
router.route('/update-profile')
    .put(protect, updateProfile);

// Change password route
router.route('/change-password')
    .put(protect, changePassword);

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

