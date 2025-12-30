const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post(
    '/signup',
    [
        check('fullName', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
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
