const User = require('../models/User');

// @desc    Get all users with pagination and search
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const search = req.query.search || '';
        const status = req.query.status; // Filter by status: 'active' or 'inactive'
        const role = req.query.role; // Filter by role: 'user' or 'admin'

        // Build query filter - default to showing only 'user' role (not admins)
        let filter = { role: 'user' };

        // Allow admin to see all users including admins by passing role=all
        if (role === 'all') {
            delete filter.role;
        } else if (role && ['user', 'admin'].includes(role)) {
            filter.role = role;
        }

        // Filter by status
        if (status && ['active', 'inactive'].includes(status)) {
            filter.status = status;
        }

        // Search by name or email - combine with existing filters using $and
        if (search) {
            filter = {
                $and: [
                    filter,
                    {
                        $or: [
                            { fullName: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } }
                        ]
                    }
                ]
            };
        }

        const count = await User.countDocuments(filter);
        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 }) // Newest first
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            users,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
            limit: pageSize
        });
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Activate user account
// @route   PUT /api/users/:id/activate
// @access  Private/Admin
const activateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from activating themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot modify your own account status' });
        }

        if (user.status === 'active') {
            return res.status(400).json({ message: 'User is already active' });
        }

        user.status = 'active';
        await user.save();

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            message: 'User activated successfully'
        });
    } catch (error) {
        console.error('Activate User Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Deactivate user account
// @route   PUT /api/users/:id/deactivate
// @access  Private/Admin
const deactivateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from deactivating themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot modify your own account status' });
        }

        if (user.status === 'inactive') {
            return res.status(400).json({ message: 'User is already inactive' });
        }

        user.status = 'inactive';
        await user.save();

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            message: 'User deactivated successfully'
        });
    } catch (error) {
        console.error('Deactivate User Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user status (Activate/Deactivate) - Generic endpoint
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be "active" or "inactive"' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from modifying their own status
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot modify your own account status' });
        }

        user.status = status;
        await user.save();

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get own profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile (fullName and email only)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { fullName, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email is being changed and if new email already exists
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email;
        }

        // Update fullName if provided
        if (fullName) {
            user.fullName = fullName;
        }

        // Save without triggering password hash (no password change here)
        await User.updateOne(
            { _id: user._id },
            { fullName: user.fullName, email: user.email }
        );

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Please provide current password, new password, and confirm password' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        // Get user with password
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Update password (this will trigger the pre-save hook to hash it)
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get total count of users (public for verification)
// @route   GET /api/users/count
// @access  Public
const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments({});
        res.json({ totalUsers: count });
    } catch (error) {
        console.error('Get User Count Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
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
};

