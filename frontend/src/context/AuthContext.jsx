import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Set up axios interceptor/defaults
    useEffect(() => {
        if (user?.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [user]);

    // Check for existing user on load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (userData) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
        }
    };

    const signup = async (userData) => {
        const response = await axios.post('http://localhost:5000/api/auth/signup', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const updateUser = (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
