import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = () => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    // If user is already authenticated, redirect based on role
    if (isAuthenticated) {
        const from = location.state?.from?.pathname;
        if (from) {
            return <Navigate to={from} replace />;
        }
        // Role-based redirect
        const redirectPath = user?.role === 'ADMIN' ? '/admin/dashboard' : '/my-bookings';
        return <Navigate to={redirectPath} replace />;
    }

    // If not authenticated, render the public page
    return <Outlet />;
};

export default PublicRoute;
