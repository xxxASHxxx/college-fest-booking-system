import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminRoute = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    console.log('[AdminRoute] Auth check:', {
        loading,
        isAuthenticated,
        userRole: user?.role,
        userEmail: user?.email,
        path: location.pathname
    });

    // Show loading spinner while checking authentication
    if (loading) {
        console.log('[AdminRoute] Loading authentication state...');
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}>
                <LoadingSpinner size="large" />
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        console.log('[AdminRoute] User not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated but not admin, redirect to home
    if (user?.role !== 'ADMIN') {
        console.log('[AdminRoute] User is not admin (role:', user?.role, '), redirecting to home');
        return <Navigate to="/" replace />;
    }

    console.log('[AdminRoute] Admin user verified, rendering admin content');
    // If authenticated and admin, render the admin page
    return <Outlet />;
};

export default AdminRoute;
