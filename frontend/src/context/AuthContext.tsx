
import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const login = async (email: any, password: any) => {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        console.log('Login response:', res.data);
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        
        // Store user data in localStorage as well for immediate access
        localStorage.setItem('user', JSON.stringify(res.data.user));
    };

    const signup = async (username: any, email: any, password: any) => {
        const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const refreshUser = async () => {
        if (token) {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Refreshed user data:", res.data.user);
                setUser(res.data.user);
            } catch (err) {
                console.error("Error refreshing user:", err);
                logout();
            }
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/me', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log("Initial user data:", res.data.user);
                    setUser(res.data.user);
                } catch (err) {
                    console.error("Error fetching user:", err);
                    logout();
                }
            }
        };
        fetchUser();
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
