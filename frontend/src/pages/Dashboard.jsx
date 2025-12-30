import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user, logout, updateUser } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');

    // Profile State
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
    });

    // Password State
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Validations & Messages
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Initial load
    useEffect(() => {
        if (user) {
            setProfileData({
                fullName: user.fullName,
                email: user.email
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await axios.put('http://localhost:5000/api/users/update-profile', profileData);
            updateUser(data); // Update context with new user data
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await axios.put('http://localhost:5000/api/users/change-password', passwords);
            setMessage('Password changed successfully!');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header className="navbar" style={{ borderRadius: 'var(--radius)', marginTop: '1rem' }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'white' }}>UserManagement</div>
                <div className="nav-links">
                    <span style={{ color: 'var(--text-muted)' }}>Hello, {user?.fullName} <span style={{ fontSize: '0.8em', background: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', color: 'white' }}>{user?.role}</span></span>
                    <button className="btn btn-secondary" onClick={logout} style={{ padding: '0.5rem 1rem' }}>Logout</button>
                </div>
            </header>

            <div className="glass-card" style={{ padding: '2rem', minHeight: '60vh' }}>

                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile Settings
                    </button>
                    {user?.role === 'admin' && (
                        <button
                            className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
                            onClick={() => setActiveTab('admin')}
                        >
                            Admin Controls
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className="tab-content">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div style={{ animation: 'fadeIn 0.3s' }}>
                            <h2>Welcome back, {user?.fullName}!</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                                You are logged in as <strong>{user?.role}</strong>.
                            </p>
                            <div className="grid-2" style={{ marginTop: '2rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px' }}>
                                    <h3 style={{ fontSize: '1.2rem' }}>Account Status</h3>
                                    <p style={{ color: 'var(--success)' }}>Active</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px' }}>
                                    <h3 style={{ fontSize: '1.2rem' }}>Email</h3>
                                    <p>{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="grid-2" style={{ animation: 'fadeIn 0.3s', alignItems: 'start' }}>
                            {/* Update Profile Form */}
                            <div>
                                <h3>Update Profile</h3>
                                {message && <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>{message}</div>}
                                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}

                                <form onSubmit={handleProfileUpdate}>
                                    <div className="input-group">
                                        <label className="input-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={profileData.fullName}
                                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="input-field"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Updating...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>

                            {/* Change Password Form */}
                            <div>
                                <h3>Change Password</h3>
                                <form onSubmit={handlePasswordChange}>
                                    <div className="input-group">
                                        <label className="input-label">Current Password</label>
                                        <input
                                            type="password"
                                            className="input-field"
                                            value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">New Password</label>
                                        <input
                                            type="password"
                                            className="input-field"
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="input-field"
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-secondary" disabled={loading}>
                                        {loading ? 'Changing...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ADMIN TAB */}
                    {activeTab === 'admin' && user?.role === 'admin' && (
                        <AdminPanel />
                    )}
                </div>
            </div>
        </div>
    );
};

// Admin Panel Component to keep Dashboard clean
const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'user', 'admin'
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, roleFilter, statusFilter, page]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            let query = `?page=${page}&limit=5`;
            if (search) query += `&search=${search}`;
            if (roleFilter !== 'all') query += `&role=${roleFilter}`;
            if (statusFilter !== 'all') query += `&status=${statusFilter}`;

            const { data } = await axios.get(`http://localhost:5000/api/users${query}`);
            setUsers(data.users);
            setTotalPages(data.pages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            // Optimistic update
            setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));

            if (newStatus === 'active') {
                await axios.put(`http://localhost:5000/api/users/${userId}/activate`);
            } else {
                await axios.put(`http://localhost:5000/api/users/${userId}/deactivate`);
            }
        } catch (err) {
            console.error('Failed to update status', err);
            fetchUsers(); // Revert on failure
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3>User Management</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="input-field"
                        style={{ padding: '0.5rem', width: '200px' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="input-field"
                        style={{ padding: '0.5rem', width: 'auto' }}
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <select
                        className="input-field"
                        style={{ padding: '0.5rem', width: 'auto' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>User</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Last Login</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '600' }}>{user.fullName}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            background: user.role === 'admin' ? 'rgba(129, 140, 248, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                            color: user.role === 'admin' ? '#818cf8' : 'white',
                                            fontSize: '0.85rem'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            color: user.status === 'active' ? 'var(--success)' : 'var(--error)',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                                        }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: user.status === 'active' ? 'var(--success)' : 'var(--error)' }}></span>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            {user.status === 'active' ? (
                                                <button
                                                    onClick={() => handleStatusChange(user._id, 'inactive')}
                                                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}
                                                >
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleStatusChange(user._id, 'active')}
                                                    style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}
                                                >
                                                    Activate
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', padding: '0.4rem' }}
                                                title="Delete User"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', opacity: page === 1 ? 0.5 : 1 }}
                    >
                        Prev
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', color: 'var(--text-muted)' }}>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', opacity: page === totalPages ? 0.5 : 1 }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
