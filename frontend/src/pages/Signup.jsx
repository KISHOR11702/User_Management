import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Notification from '../components/Notification';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' // Default role
    });
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);

    const { fullName, email, password, confirmPassword, role } = formData;
    const authContext = useContext(AuthContext);
    const { signup } = authContext;

    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification(null);

        if (!fullName || !email || !password || !confirmPassword) {
            setNotification({ message: 'Please fill in all fields', type: 'error' });
            return;
        }

        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(fullName)) {
            setNotification({ message: 'Name can only contain letters and spaces', type: 'error' });
            return;
        }

        if (password !== confirmPassword) {
            setNotification({ message: 'Passwords do not match', type: 'error' });
            return;
        }

        if (password.length < 6) {
            setNotification({ message: 'Password must be at least 6 characters', type: 'error' });
            return;
        }

        if (!/\d/.test(password)) {
            setNotification({ message: 'Password must contain at least one number', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            await signup({ fullName, email, password, confirmPassword, role });
            navigate('/dashboard');
        } catch (err) {
            // Handle array of errors from express-validator or single message
            let msg = 'Signup failed';
            if (err.response?.data?.errors) {
                msg = err.response.data.errors.map((e) => e.msg).join(', ');
            } else if (err.response?.data?.message) {
                msg = err.response.data.message;
            }
            setNotification({ message: msg, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="center-box">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            <div className="glass-card auth-form">
                <h1>Create Account</h1>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            className="input-field"
                            value={fullName}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="input-field"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Role</label>
                        <select
                            name="role"
                            className="input-field"
                            value={role}
                            onChange={onChange}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input-field"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="input-field"
                            value={confirmPassword}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
