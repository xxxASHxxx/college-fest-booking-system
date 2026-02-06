import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import bookingService from '../services/bookingService';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TicketCard from '../components/ticket/TicketCard';
import { FiCheck, FiDownload, FiMail, FiHome } from 'react-icons/fi';
import { formatDate, formatTime, formatCurrency } from '../utils/formatters';
import { trackPageView, trackBookingCompleted } from '../utils/analytics';
import Confetti from 'react-confetti';
import './BookingConfirmationPage.css';

const BookingConfirmationPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { showError, showSuccess } = useToast();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        trackPageView('Booking Confirmation');
        fetchBookingDetails();

        // Hide confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
    }, []);

    useEffect(() => {
        if (booking) {
            trackBookingCompleted(booking.id, booking.totalAmount, booking.event.id);
        }
    }, [booking]);

    const fetchBookingDetails = async () => {
        try {
            const result = await bookingService.getBookingById(bookingId);
            if (result.success) {
                setBooking(result.data);
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

    const handleDownloadTickets = async () => {
        try {
            const result = await bookingService.downloadTickets(bookingId);
            if (result.success) {
                showSuccess('Tickets downloaded successfully');
            }
        } catch (error) {
            showError('Failed to download tickets');
        }
    };

    const handleEmailTickets = async () => {
        try {
            const result = await bookingService.emailTickets(bookingId);
            if (result.success) {
                showSuccess('Tickets sent to your email');
            }
        } catch (error) {
            showError('Failed to send tickets');
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

    return (
        <div className="booking-confirmation-page">
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={500}
                />
            )}

            <div className="confirmation-container">
                {/* Success Header */}
                <div className="confirmation-header">
                    <div className="success-icon">
                        <FiCheck />
                    </div>
                    <h1 className="confirmation-title">Booking Confirmed! 🎉</h1>
                    <p className="confirmation-message">
                        Your tickets have been booked successfully. Check your email for confirmation.
                    </p>
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
                            <span className="info-value">{booking.event.name}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Date & Time</span>
                            <span className="info-value">
                                {formatDate(booking.event.date)} at {formatTime(booking.event.date)}
                            </span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Venue</span>
                            <span className="info-value">{booking.event.venue}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Number of Tickets</span>
                            <span className="info-value">{booking.quantity}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Total Amount</span>
                            <span className="info-value highlight">
                                {formatCurrency(booking.totalAmount)}
                            </span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">Payment Status</span>
                            <span className="status-badge success">Paid</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="booking-actions">
                        <Button
                            variant="primary"
                            icon={<FiDownload />}
                            onClick={handleDownloadTickets}
                        >
                            Download Tickets
                        </Button>
                        <Button
                            variant="outline"
                            icon={<FiMail />}
                            onClick={handleEmailTickets}
                        >
                            Email Tickets
                        </Button>
                    </div>
                </div>

                {/* Tickets */}
                <div className="tickets-section">
                    <h2 className="section-title">Your Tickets</h2>
                    <div className="tickets-grid">
                        {booking.tickets.map((ticket) => (
                            <TicketCard key={ticket.id} ticket={ticket} booking={booking} />
                        ))}
                    </div>
                </div>

                {/* Important Information */}
                <div className="important-info">
                    <h3>Important Information</h3>
                    <ul>
                        <li>Please arrive at least 30 minutes before the event starts</li>
                        <li>Carry a valid ID proof along with your ticket</li>
                        <li>Tickets are non-transferable and non-refundable</li>
                        <li>Keep your QR code handy for quick entry</li>
                        <li>For any queries, contact support at support@festbook.com</li>
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
                        onClick={() => navigate('/my-bookings')}
                    >
                        View All Bookings
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmationPage;
