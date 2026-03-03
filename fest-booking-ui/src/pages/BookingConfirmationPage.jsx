import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import bookingService from '../services/bookingService';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiCheck, FiHome, FiTag } from 'react-icons/fi';
import { formatCurrency } from '../utils/formatters';
import { trackPageView } from '../utils/analytics';
import './BookingConfirmationPage.css';

const BookingConfirmationPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { showError } = useToast();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        trackPageView('Booking Confirmation');
        fetchBookingDetails();
    }, []);

    const fetchBookingDetails = async () => {
        try {
            const result = await bookingService.getBookingById(bookingId);
            if (result.success) {
                // Unwrap ApiResponse: result.data may be { data: <dto> } or the dto directly
                const bookingData = result.data?.data || result.data;
                setBooking(bookingData);
            } else {
                showError('Booking not found');
                navigate('/');
            }
        } catch (error) {
            showError('Failed to load booking details');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="confirmation-loading">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    const paymentMethodLabel = {
        CARD: 'Credit / Debit Card',
        UPI: 'UPI',
        NETBANKING: 'Net Banking',
        WALLET: 'Wallet',
    }[booking.paymentMethod] || booking.paymentMethod || '—';

    return (
        <div className="booking-confirmation-page">
            {/* CSS confetti effect (no external package needed) */}
            <div className="confetti-container" aria-hidden="true">
                {Array.from({ length: 40 }).map((_, i) => (
                    <div
                        key={i}
                        className="confetti-piece"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                            backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][i % 6],
                        }}
                    />
                ))}
            </div>

            <div className="confirmation-container">
                {/* Success Header */}
                <div className="confirmation-header">
                    <div className="success-icon">
                        <FiCheck />
                    </div>
                    <h1 className="confirmation-title">Booking Confirmed! 🎉</h1>
                    <p className="confirmation-message">
                        Your tickets are booked and ready. Show your booking reference at the venue.
                    </p>
                </div>

                {/* Booking Reference Banner */}
                <div className="booking-reference-banner">
                    <FiTag />
                    <span>Booking Reference: </span>
                    <strong>{booking.bookingReference}</strong>
                </div>

                {/* Booking Details */}
                <div className="booking-details-card">
                    <div className="booking-info-header">
                        <h2>Booking Details</h2>
                        <span className="booking-id">#{booking.id}</span>
                    </div>

                    <div className="booking-info-grid">
                        <div className="info-item">
                            <span className="info-label">Event</span>
                            <span className="info-value">{booking.eventName}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Ticket Tier</span>
                            <span className="info-value">{booking.tierName}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Number of Tickets</span>
                            <span className="info-value">{booking.numTickets}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Total Amount</span>
                            <span className="info-value highlight">
                                {formatCurrency(booking.totalAmount)}
                            </span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Payment Method</span>
                            <span className="info-value">{paymentMethodLabel}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Payment Status</span>
                            <span className="status-badge success">Paid ✓</span>
                        </div>

                        {booking.seatNumbers && booking.seatNumbers.length > 0 && (
                            <div className="info-item full-width">
                                <span className="info-label">Seat Numbers</span>
                                <span className="info-value">
                                    {booking.seatNumbers.join(', ')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Important Information */}
                <div className="important-info">
                    <h3>Important Information</h3>
                    <ul>
                        <li>Please arrive at least 30 minutes before the event starts</li>
                        <li>Carry a valid ID proof along with your booking reference</li>
                        <li>Tickets are non-transferable and non-refundable</li>
                        <li>Keep your booking reference handy for quick entry</li>
                        <li>For any queries, contact the college fest helpdesk</li>
                    </ul>
                </div>

                {/* Navigation Buttons */}
                <div className="confirmation-footer">
                    <Button
                        variant="outline"
                        size="large"
                        icon={<FiHome />}
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </Button>
                    <Button
                        variant="primary"
                        size="large"
                        onClick={() => navigate('/my-tickets')}
                    >
                        View My Tickets
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmationPage;
