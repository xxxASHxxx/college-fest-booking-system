import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';

// Lazy load pages
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

const EventsPage = lazy(() => import('../pages/EventsPage'));
const EventDetailsPage = lazy(() => import('../pages/EventDetailsPage'));
const BookingPage = lazy(() => import('../pages/BookingPage'));
const BookingConfirmationPage = lazy(() => import('../pages/BookingConfirmationPage'));

const ProfilePage = lazy(() => import('../pages/user/ProfilePage'));
const MyBookingsPage = lazy(() => import('../pages/user/MyBookingsPage'));
const BookingDetailsPage = lazy(() => import('../pages/user/BookingDetailsPage'));
const MyTicketsPage = lazy(() => import('../pages/user/MyTicketsPage'));
const TicketDetailsPage = lazy(() => import('../pages/user/TicketDetailsPage'));
const SettingsPage = lazy(() => import('../pages/user/SettingsPage'));

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminEventsPage = lazy(() => import('../pages/admin/AdminEventsPage'));
const AdminEventFormPage = lazy(() => import('../pages/admin/AdminEventFormPage'));
const AdminBookingsPage = lazy(() => import('../pages/admin/AdminBookingsPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));
const AdminAnalyticsPage = lazy(() => import('../pages/admin/AdminAnalyticsPage'));
const AdminReportsPage = lazy(() => import('../pages/admin/AdminReportsPage'));
const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage'));

const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Loading fallback component
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
    </div>
);

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />

                {/* Auth Routes - Only accessible when not logged in */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/forgot-password"
                    element={
                        <PublicRoute>
                            <ForgotPasswordPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/reset-password/:token"
                    element={
                        <PublicRoute>
                            <ResetPasswordPage />
                        </PublicRoute>
                    }
                />

                {/* Protected Routes - Require authentication */}
                <Route
                    path="/booking/:eventId"
                    element={
                        <ProtectedRoute>
                            <BookingPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/booking-confirmation/:bookingId"
                    element={
                        <ProtectedRoute>
                            <BookingConfirmationPage />
                        </ProtectedRoute>
                    }
                />

                {/* User Routes */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-bookings"
                    element={
                        <ProtectedRoute>
                            <MyBookingsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-bookings/:bookingId"
                    element={
                        <ProtectedRoute>
                            <BookingDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-tickets"
                    element={
                        <ProtectedRoute>
                            <MyTicketsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-tickets/:ticketId"
                    element={
                        <ProtectedRoute>
                            <TicketDetailsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes - Require admin role */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/events"
                    element={
                        <AdminRoute>
                            <AdminEventsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/events/new"
                    element={
                        <AdminRoute>
                            <AdminEventFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/events/edit/:eventId"
                    element={
                        <AdminRoute>
                            <AdminEventFormPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/bookings"
                    element={
                        <AdminRoute>
                            <AdminBookingsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <AdminRoute>
                            <AdminUsersPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/analytics"
                    element={
                        <AdminRoute>
                            <AdminAnalyticsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/reports"
                    element={
                        <AdminRoute>
                            <AdminReportsPage />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/settings"
                    element={
                        <AdminRoute>
                            <AdminSettingsPage />
                        </AdminRoute>
                    }
                />

                {/* 404 Not Found */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
