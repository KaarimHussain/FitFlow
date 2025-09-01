import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthService, type IUser, type IAuthResponse, type ISignIn, type ISignUp } from '@/service/auth.service';
import { useNavigate } from 'react-router-dom';

// Define auth context state
type AuthContextState = {
    user: IUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    signIn: (credentials: ISignIn) => Promise<IAuthResponse>;
    signUp: (userData: ISignUp) => Promise<IAuthResponse>;
    signOut: () => Promise<void>;
    verifyEmail: () => Promise<IAuthResponse>;
    forgotPassword: (email: string) => Promise<IAuthResponse>;
    resetPassword: (token: string, newPassword: string) => Promise<IAuthResponse>;
};

// Create initial context state
const initialState: AuthContextState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    signIn: async () => ({ success: false }),
    signUp: async () => ({ success: false }),
    signOut: async () => { },
    verifyEmail: async () => ({ success: false }),
    forgotPassword: async () => ({ success: false }),
    resetPassword: async () => ({ success: false }),
};

// Create context
const AuthContext = createContext<AuthContextState>(initialState);

// Define provider props
type AuthProviderProps = {
    children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<IUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);
            try {
                // Check if user is already authenticated
                if (AuthService.isAuthenticated()) {
                    // Get current user data
                    const response = await AuthService.getCurrentUser();
                    if (response.success && response.user) {
                        setUser(response.user);
                        setIsAuthenticated(true);
                    } else {
                        // Token might be invalid or expired
                        await AuthService.SignOut();
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (err) {
                setError('Failed to initialize authentication');
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Sign in function
    const signIn = useCallback(async (credentials: ISignIn): Promise<IAuthResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await AuthService.SignIn(credentials);
            if (response.success && response.user) {
                setUser(response.user);
                setIsAuthenticated(true);
            } else {
                setError(response.message || 'Sign in failed');
            }
            return response;
        } catch (err) {
            const errorMessage = 'An unexpected error occurred during sign in';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Sign up function
    const signUp = useCallback(async (userData: ISignUp): Promise<IAuthResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await AuthService.SignUp(userData);
            if (response.success && response.user) {
                setUser(response.user);
                setIsAuthenticated(true);
            } else {
                setError(response.message || 'Sign up failed');
            }
            return response;
        } catch (err) {
            const errorMessage = 'An unexpected error occurred during sign up';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Sign out function
    const signOut = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            await AuthService.SignOut();
            setUser(null);
            setIsAuthenticated(false);
            navigate('/');
        } catch (err) {
            setError('Failed to sign out');
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    // Verify email function
    const verifyEmail = useCallback(async (): Promise<IAuthResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await AuthService.verifyEmail();
            return response;
        } catch (err) {
            const errorMessage = 'Failed to verify email';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Forgot password function
    const forgotPassword = useCallback(async (email: string): Promise<IAuthResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await AuthService.forgotPassword(email);
            return response;
        } catch (err) {
            const errorMessage = 'Failed to process forgot password request';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Reset password function
    const resetPassword = useCallback(
        async (token: string, newPassword: string): Promise<IAuthResponse> => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await AuthService.resetPassword(token, newPassword);
                return response;
            } catch (err) {
                const errorMessage = 'Failed to reset password';
                setError(errorMessage);
                return { success: false, message: errorMessage };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    // Context value
    const value = {
        user,
        isAuthenticated,
        isLoading,
        error,
        signIn,
        signUp,
        signOut,
        verifyEmail,
        forgotPassword,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};