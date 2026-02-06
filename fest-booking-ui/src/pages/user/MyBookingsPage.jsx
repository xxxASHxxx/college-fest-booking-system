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
    const { user } = useAuth();
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
            const response = await bookingService.getUserBookings();
            setBookings(response.data || []);
        } catch (err) {
            setError('Failed to load bookings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            confirmed: 'success',
            pending: 'warning',
            cancelled: 'danger',
        };
        return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
    };

    const filteredBookings = bookings.filter((booking) => {
        if (filter === 'all') return true;
        if (filter === 'upcoming') {
            return new Date(booking.event?.date) >= new Date();
        }
        if (filter === 'past') {
            return new Date(booking.event?.date) < new Date();
        }
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
                                    <h3>{booking.event?.name}</h3>
                                    <p className="booking-date">
                                        📅 {new Date(booking.event?.date).toLocaleDateString()}
                                    </p>
                                    <p className="booking-venue">
                                        📍 {booking.event?.venue}
                                    </p>
                                </div>
                                <div className="booking-details">
                                    <div className="booking-detail">
                                        <span className="label">Seats:</span>
                                        <span className="value">{booking.seatsBooked}</span>
                                    </div>
                                    <div className="booking-detail">
                                        <span className="label">Amount:</span>
                                        <span className="value">₹{booking.totalAmount}</span>
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
