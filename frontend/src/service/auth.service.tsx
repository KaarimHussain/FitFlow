export interface ISignIn {
    email: string;
    password: string;
}

export interface ISignUp {
    username: string;
    email: string;
    password: string;
}

export interface IUser {
    id: string;
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
}

export interface IAuthResponse {
    success: boolean;
    token?: string;
    user?: IUser;
    message?: string;
    errors?: string[];
}

export class AuthService {
    private static readonly BASE_URL = import.meta.env.VITE_SERVER_URL;

    static async SignIn(request: ISignIn): Promise<IAuthResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
                credentials: 'include' // Include cookies if needed
            });

            const data: IAuthResponse = await response.json();

            if (data.success && data.token) {
                // Store token in localStorage
                localStorage.setItem('token', data.token);

                // Store user data if needed
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
            }

            return data;
        } catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again.'
            };
        }
    }

    static async SignUp(request: ISignUp): Promise<IAuthResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
                credentials: 'include'
            });

            const data: IAuthResponse = await response.json();

            if (data.success && data.token) {
                // Store token in localStorage
                localStorage.setItem('token', data.token);

                // Store user data if needed
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
            }

            return data;
        } catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again.'
            };
        }
    }

    static async SignOut(): Promise<void> {
        try {
            // Make API call to logout endpoint if you have one
            await fetch(`${this.BASE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
        } catch (error) {
            // Ignore errors during logout
            console.error('Logout error:', error);
        } finally {
            // Clear local storage regardless of API result
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    static async getCurrentUser(): Promise<IAuthResponse> {
        const token = this.getToken();

        if (!token) {
            return {
                success: false,
                message: 'No authentication token found'
            };
        }

        try {
            const response = await fetch(`${this.BASE_URL}/api/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const data: IAuthResponse = await response.json();

            if (data.success && data.user) {
                // Update stored user data
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            return data;
        } catch (error) {
            return {
                success: false,
                message: 'Failed to fetch user data'
            };
        }
    }

    static async verifyEmail(): Promise<IAuthResponse> {
        const token = this.getToken();

        if (!token) {
            return {
                success: false,
                message: 'No authentication token found'
            };
        }

        try {
            const response = await fetch(`${this.BASE_URL}/api/auth/verify`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            return await response.json();
        } catch (error) {
            return {
                success: false,
                message: 'Failed to verify email'
            };
        }
    }

    static getToken(): string | null {
        return localStorage.getItem('token');
    }

    static getUser(): IUser | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    static isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        // Optional: Check if token is expired
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } catch {
            return false;
        }
    }

    static async forgotPassword(email: string): Promise<IAuthResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            return await response.json();
        } catch (error) {
            return {
                success: false,
                message: 'Failed to process forgot password request'
            };
        }
    }

    static async resetPassword(token: string, newPassword: string): Promise<IAuthResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            return await response.json();
        } catch (error) {
            return {
                success: false,
                message: 'Failed to reset password'
            };
        }
    }
}