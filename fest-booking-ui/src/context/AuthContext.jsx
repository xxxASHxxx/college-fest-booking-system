import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = () => {
            const currentUser = authService.getCurrentUser();
            const authenticated = authService.isAuthenticated();
            const adminStatus = authService.isAdmin();

            setUser(currentUser);
            setIsAuthenticated(authenticated);
            setIsAdmin(adminStatus);
            setIsLoading(false);
        };

        initAuth();
    }, []);

    // Login function
    const login = useCallback(async (email, password, rememberMe = false) => {
        try {
            const result = await authService.login(email, password);

            if (result.success) {
                const { user: userData } = result.data;
                setUser(userData);
                setIsAuthenticated(true);
                setIsAdmin(userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN');

                toast.success(`Welcome back, ${userData.name}!`);
                return { success: true, user: userData };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMsg = 'Login failed. Please try again.';
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    // Register function
    const register = useCallback(async (userData) => {
        try {
            const result = await authService.register(userData);

            if (result.success) {
                const { user: newUser } = result.data;
                setUser(newUser);
                setIsAuthenticated(true);
                setIsAdmin(newUser.role === 'ADMIN' || newUser.role === 'SUPER_ADMIN');

                toast.success(`Welcome, ${newUser.name}! Your account has been created.`);
                return { success: true, user: newUser };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            const errorMsg = 'Registration failed. Please try again.';
            toast.error(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
            toast.info('You have been logged out.');
        } catch (error) {
            console.error('Logout error:', error);
            // Clear state anyway
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
        }
    }, []);

    // Update user profile
    const updateProfile = useCallback((updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully!');
    }, []);

    // Refresh user data
    const refreshUserData = useCallback(async () => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            setIsAdmin(currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN');
        }
    }, []);

    const value = {
        user,
        isAuthenticated,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        refreshUserData,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
