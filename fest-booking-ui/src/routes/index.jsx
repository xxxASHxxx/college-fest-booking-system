import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Public Pages
import HomePage from '../pages/HomePage';
import EventsPage from '../pages/EventsPage';
import EventDetailsPage from '../pages/EventDetailsPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

// User Pages
import BookingPage from '../pages/BookingPage';
import BookingConfirmationPage from '../pages/BookingConfirmationPage';
import MyBookingsPage from '../pages/user/MyBookingsPage';
import MyTicketsPage from '../pages/user/MyTicketsPage';
import TicketDetailsPage from '../pages/user/TicketDetailsPage';
import ProfilePage from '../pages/user/ProfilePage';
import SettingsPage from '../pages/user/SettingsPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageEventsPage from '../pages/admin/ManageEventsPage';
import CreateEventPage from '../pages/admin/CreateEventPage';
import ManageBookingsPage from '../pages/admin/ManageBookingsPage';
import ManageUsersPage from '../pages/admin/ManageUsersPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />

                {/* Auth Routes - Redirect if already logged in */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Private User Routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/booking/:eventId" element={<BookingPage />} />
                    <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
                    <Route path="/my-bookings" element={<MyBookingsPage />} />
                    <Route path="/my-bookings/:id" element={<MyBookingsPage />} />
                    <Route path="/my-tickets" element={<MyTicketsPage />} />
                    <Route path="/my-tickets/:ticketId" element={<TicketDetailsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/events" element={<ManageEventsPage />} />
                    <Route path="/admin/events/create" element={<CreateEventPage />} />
                    <Route path="/admin/events/edit/:id" element={<CreateEventPage />} />
                    <Route path="/admin/bookings" element={<ManageBookingsPage />} />
                    <Route path="/admin/users" element={<ManageUsersPage />} />
                </Route>
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
