const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post(
    '/signup',
    [
        check('fullName')
            .not().isEmpty().withMessage('Full name is required')
            .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
        check('email', 'Please include a valid email address').isEmail(),
        check('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
            .matches(/\d/).withMessage('Password must contain at least one number')
    ],
    signup
);

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    login
);

router.get('/me', protect, getMe);

module.exports = router;
