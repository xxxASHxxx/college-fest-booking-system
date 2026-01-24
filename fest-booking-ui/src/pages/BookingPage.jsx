import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useTimer } from '../hooks/useTimer';
import eventService from '../services/eventService';
import bookingService from '../services/bookingService';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BookingSummary from '../components/booking/BookingSummary';
import SeatSelection from '../components/booking/SeatSelection';
import PaymentForm from '../components/booking/PaymentForm';
import { FiCheck, FiClock } from 'react-icons/fi';
import { BOOKING_TIMER_DURATION } from '../utils/constants';
import { trackPageView, trackBookingStarted } from '../utils/analytics';
import './BookingPage.css';

const BookingPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();

    const [event, setEvent] = useState(location.state?.event || null);
    const [loading, setLoading] = useState(!event);
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        quantity: location.state?.quantity || 1,
        seatType: 'general',
        selectedSeats: [],
        userDetails: {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        },
        paymentMethod: '',
    });
    const [submitting, setSubmitting] = useState(false);

    // Booking timer
    const { seconds, formatTime, restart } = useTimer(BOOKING_TIMER_DURATION, true);

    useEffect(() => {
        trackPageView('Booking');
        if (!event) {
            fetchEvent();
        } else {
            trackBookingStarted(event.id, event.name);
        }
    }, []);

    useEffect(() => {
        if (seconds === 0) {
            showError('Booking session expired. Please try again.');
            navigate(`/events/${eventId}`);
        }
    }, [seconds]);

    const fetchEvent = async () => {
        try {
            const result = await eventService.getEventById(eventId);
            if (result.success) {
                setEvent(result.data);
                trackBookingStarted(result.data.id, result.data.name);
            } else {
                showError('Event not found');
                navigate('/events');
            }
        } catch (error) {
            showError('Failed to load event');
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    const handleStepComplete = (stepData) => {
        setBookingData({ ...bookingData, ...stepData });

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBookingSubmit = async (paymentData) => {
        setSubmitting(true);

        try {
            const bookingPayload = {
                eventId: event.id,
                quantity: bookingData.quantity,
                seatType: bookingData.seatType,
                selectedSeats: bookingData.selectedSeats,
                userDetails: bookingData.userDetails,
                paymentMethod: paymentData.method,
                paymentDetails: paymentData.details,
            };

            const result = await bookingService.createBooking(bookingPayload);

            if (result.success) {
                showSuccess('Booking confirmed!');
                navigate(`/booking-confirmation/${result.data.id}`);
            } else {
                showError(result.error || 'Booking failed');
            }
        } catch (error) {
            showError('Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="booking-loading">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    const steps = [
        { number: 1, title: 'Seat Selection', icon: '🎫' },
        { number: 2, title: 'Your Details', icon: '📝' },
        { number: 3, title: 'Payment', icon: '💳' },
    ];

    return (
        <div className="booking-page">
            <div className="booking-container">
                {/* Timer */}
                <div className="booking-timer">
                    <FiClock />
                    <span>Time remaining: {formatTime()}</span>
                </div>

                {/* Progress Steps */}
                <div className="booking-steps">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className={`booking-step ${currentStep >= step.number ? 'active' : ''} ${
                                currentStep > step.number ? 'completed' : ''
                            }`}
                        >
                            <div className="step-icon">
                                {currentStep > step.number ? <FiCheck /> : step.icon}
                            </div>
                            <div className="step-info">
                                <span className="step-number">Step {step.number}</span>
                                <span className="step-title">{step.title}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="booking-content">
                    <div className="booking-main">
                        {currentStep === 1 && (
                            <SeatSelection
                                event={event}
                                initialQuantity={bookingData.quantity}
                                onComplete={handleStepComplete}
                            />
                        )}

                        {currentStep === 2 && (
                            <UserDetailsForm
                                initialData={bookingData.userDetails}
                                onComplete={handleStepComplete}
                                onBack={() => setCurrentStep(1)}
                            />
                        )}

                        {currentStep === 3 && (
                            <PaymentForm
                                event={event}
                                bookingData={bookingData}
                                onSubmit={handleBookingSubmit}
                                onBack={() => setCurrentStep(2)}
                                submitting={submitting}
                            />
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="booking-sidebar">
                        <BookingSummary
                            event={event}
                            bookingData={bookingData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// User Details Form Component
const UserDetailsForm = ({ initialData, onComplete, onBack }) => {
    const [formData, setFormData] = useState(initialData);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onComplete({ userDetails: formData });
        }
    };

    return (
        <div className="user-details-form">
            <h2 className="form-title">Your Details</h2>
            <p className="form-subtitle">Please provide your contact information</p>

            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Enter your full name"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="Enter your email"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="Enter your phone number"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-actions">
                    <Button variant="outline" onClick={onBack}>
                        Back
                    </Button>
                    <Button type="submit">
                        Continue to Payment
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BookingPage;
