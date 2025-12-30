import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div className="center-box">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
