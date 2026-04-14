import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import bookingService from '../../services/bookingService';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
    useAuth(); // Ensure user is authenticated (route protection handles the rest)
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, upcoming, past

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingService.getMyBookings();
            if (response.success) {
                const raw = response.data?.data || response.data;
                setBookings(Array.isArray(raw) ? raw : []);
            } else {
                setError('Failed to load bookings');
            }
        } catch (err) {
            setError('Failed to load bookings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const s = (status || '').toString().toUpperCase();
        const variants = {
            CONFIRMED: 'success',
            PENDING_PAYMENT: 'warning',
            PENDING: 'warning',
            CANCELLED: 'danger',
            EXPIRED: 'danger',
        };
        const labels = {
            CONFIRMED: 'Confirmed',
            PENDING_PAYMENT: 'Pending Payment',
            PENDING: 'Pending',
            CANCELLED: 'Cancelled',
            EXPIRED: 'Expired',
        };
        return <Badge variant={variants[s] || 'default'}>{labels[s] || status}</Badge>;
    };

    // BookingResponseDTO has flat fields: eventName, numTickets, totalAmount, bookingStatus, bookedAt
    // No nested event object — filter by bookedAt for past/upcoming
    const filteredBookings = bookings.filter((booking) => {
        if (filter === 'all') return true;
        const booked = booking.bookedAt ? new Date(booking.bookedAt) : null;
        if (filter === 'upcoming') return !booked || booked >= new Date();
        if (filter === 'past') return booked && booked < new Date();
        return true;
    });

    if (loading) {
        return (
            <div className="loading-container">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="my-bookings-page">
            <div className="container">
                <div className="page-header">
                    <h1>My Bookings</h1>
                    <p>View and manage your event bookings</p>
                </div>

                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Bookings
                    </button>
                    <button
                        className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setFilter('upcoming')}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`filter-tab ${filter === 'past' ? 'active' : ''}`}
                        onClick={() => setFilter('past')}
                    >
                        Past
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {filteredBookings.length === 0 ? (
                    <EmptyState
                        icon="📅"
                        title="No bookings found"
                        description="You haven't booked any events yet. Start exploring and book your first event!"
                        action={
                            <Link to="/events">
                                <Button>Browse Events</Button>
                            </Link>
                        }
                    />
                ) : (
                    <div className="bookings-list">
                        {filteredBookings.map((booking) => (
                            <div key={booking.id} className="booking-card">
                                <div className="booking-event-info">
                                    <h3>{booking.eventName || '—'}</h3>
                                    <p className="booking-date">
                                        📅 {booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString('en-IN') : '—'}
                                    </p>
                                    <p className="booking-reference">
                                        🎫 Ref: {booking.bookingReference || booking.id}
                                    </p>
                                </div>
                                <div className="booking-details">
                                    <div className="booking-detail">
                                        <span className="label">Tickets:</span>
                                        <span className="value">{booking.numTickets || '—'}</span>
                                    </div>
                                    <div className="booking-detail">
                                        <span className="label">Amount:</span>
                                        <span className="value">₹{booking.totalAmount != null ? Number(booking.totalAmount).toLocaleString('en-IN') : '0'}</span>
                                    </div>
                                    <div className="booking-detail">
                                        <span className="label">Status:</span>
                                        {getStatusBadge(booking.bookingStatus)}
                                    </div>
                                </div>
                                <div className="booking-actions">
                                    <Link to={`/booking-confirmation/${booking.id}`}>
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
