import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { clearAuthToken } from '../utils/helpers';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('authToken');
            const storedUser = authService.getStoredUser();

            console.log('[AuthContext] Initializing auth state:', {
                hasToken: !!token,
                hasStoredUser: !!storedUser,
                userRole: storedUser?.role,
                userEmail: storedUser?.email
            });

            if (token && storedUser) {
                // Immediately set user from localStorage (don't wait for API call)
                setUser(storedUser);
                setIsAuthenticated(true);
                console.log('[AuthContext] Set user from localStorage:', {
                    role: storedUser.role,
                    email: storedUser.email,
                    id: storedUser.id
                });

                // Verify token validity with backend
                try {
                    console.log('[AuthContext] Verifying token with backend...');
                    const result = await authService.getCurrentUser();
                    if (result.success) {
                        setUser(result.data);
                        console.log('[AuthContext] Token verified, user updated from API:', {
                            role: result.data.role,
                            email: result.data.email
                        });
                    } else {
                        // API returned error — keep stored user for demo tokens
                        console.warn('[AuthContext] Token validation returned error, keeping stored user for demo mode');
                    }
                } catch (error) {
                    // Network error (backend unreachable) — keep stored user for demo mode
                    console.warn('[AuthContext] API verification failed (backend likely down), keeping stored user');
                }
            } else {
                console.log('[AuthContext] No stored auth data found');
            }

            setLoading(false);
        };

        initializeAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty deps - only run once on mount

    // Login
    const login = useCallback(async (credentials) => {
        try {
            console.log('[AuthContext] Attempting login for:', credentials.email);
            const result = await authService.login(credentials);

            if (result.success) {
                console.log('[AuthContext] Login successful:', {
                    email: result.data.user.email,
                    role: result.data.user.role,
                    id: result.data.user.id
                });
                setUser(result.data.user);
                setIsAuthenticated(true);
                return { success: true, data: result.data };
            }

            console.warn('[AuthContext] Login failed:', result.error);
            return result;
        } catch (error) {
            console.error('[AuthContext] Login error:', error);
            return {
                success: false,
                error: error.message || 'Login failed',
            };
        }
    }, []);

    // Register
    const register = useCallback(async (userData) => {
        try {
            const result = await authService.register(userData);

            if (result.success) {
                setUser(result.data.user);
                setIsAuthenticated(true);
                return { success: true, data: result.data };
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Registration failed',
            };
        }
    }, []);

    // Logout
    const logout = useCallback(async () => {
        try {
            console.log('[AuthContext] Logging out user');
            await authService.logout();
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            clearAuthToken();
            console.log('[AuthContext] User logged out, auth state cleared');
        }
    }, []);

    // Update user profile
    const updateProfile = useCallback(async (userData) => {
        try {
            const result = await authService.updateProfile(userData);

            if (result.success) {
                setUser((prev) => ({ ...prev, ...result.data }));
                return { success: true, data: result.data };
            }

            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Profile update failed',
            };
        }
    }, []);

    // Refresh user data
    const refreshUser = useCallback(async () => {
        try {
            const result = await authService.getCurrentUser();

            if (result.success) {
                setUser(result.data);
                return { success: true };
            }

            return result;
        } catch (error) {
            return { success: false };
        }
    }, []);

    // Check if user has role
    const hasRole = useCallback((role) => {
        return user?.role === role;
    }, [user]);

    // Check if user has any of the roles
    const hasAnyRole = useCallback((roles) => {
        return roles.includes(user?.role);
    }, [user]);

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        hasRole,
        hasAnyRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
