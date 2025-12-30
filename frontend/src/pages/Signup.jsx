import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' // Default role
    });
    const [error, setError] = useState('');
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
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Basic password strength (length)
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await signup({ fullName, email, password, confirmPassword, role });
            navigate('/dashboard');
        } catch (err) {
            // Handle array of errors from express-validator or single message
            if (err.response?.data?.errors) {
                setError(err.response.data.errors.map((e) => e.msg).join(', '));
            } else {
                setError(err.response?.data?.message || 'Signup failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="center-box">
            <div className="glass-card auth-form">
                <h1>Create Account</h1>
                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
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
