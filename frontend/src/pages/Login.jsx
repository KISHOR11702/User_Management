import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Notification from '../components/Notification';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false); // Local loading state for button

    // Use type assertion or optional chaining if context might be null
    const authContext = useContext(AuthContext);
    const { login } = authContext;

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification(null);

        if (!email || !password) {
            setNotification({ message: 'Please fill in all fields', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            await login({ email, password });
            navigate('/dashboard'); // Redirect to dashboard, will handle role based redirect there or in protected route
        } catch (err) {
            let msg = err.response?.data?.message || 'Login failed';
            if (err.response?.data?.errors) {
                msg = err.response.data.errors.map(e => e.msg).join(', ');
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
                <h1>Welcome Back</h1>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
