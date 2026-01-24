import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // If user is already authenticated, redirect to home or the page they were trying to access
    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/';
        return <Navigate to={from} replace />;
    }

    // If not authenticated, render the public page
    return <Outlet />;
};

export default PublicRoute;
