import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useTimer } from '../hooks/useTimer';
import eventService from '../services/eventService';
import bookingService from '../services/bookingService';
import seedEvents from '../data/seedEvents';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import BookingSummary from '../components/booking/BookingSummary';
import PaymentForm from '../components/booking/PaymentForm';
import { FiCheck, FiClock } from 'react-icons/fi';
import { BOOKING_TIMER_DURATION } from '../utils/constants';
import { trackPageView, trackBookingStarted } from '../utils/analytics';
import './BookingPage.css';

// Map frontend payment method constants → backend PaymentMethod enum values
const PAYMENT_METHOD_MAP = {
    card: 'CARD',
    upi: 'UPI',
    netbanking: 'NETBANKING',
    wallet: 'WALLET',
};

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
        priceTierId: location.state?.priceTierId || null,
        quantity: location.state?.quantity || 1,
        seatType: 'General',
        selectedSeats: [],
        userDetails: {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        },
        paymentMethod: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const { seconds, formatTime } = useTimer(BOOKING_TIMER_DURATION, true);

    useEffect(() => {
        trackPageView('Booking');
        if (!event) {
            fetchEvent();
        } else {
            trackBookingStarted(event.id, event.eventName || event.name);
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
                const data = result.data?.data || result.data;
                setEvent(data);
                trackBookingStarted(data.id, data.eventName || data.name);
                setLoading(false);
                return;
            }
        } catch (_) { }

        // Fallback: look up from seed data
        const seed = seedEvents.find((e) => String(e.id) === String(eventId));
        if (seed) {
            setEvent(seed);
            trackBookingStarted(seed.id, seed.name);
        } else {
            showError('Event not found');
            navigate('/events');
        }
        setLoading(false);
    };

    const handleStepComplete = (stepData) => {
        setBookingData((prev) => ({ ...prev, ...stepData }));
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    // Called by PaymentForm with { method: 'card' | 'upi' | 'netbanking' | 'wallet' }
    const handleBookingSubmit = async (paymentData) => {
        setSubmitting(true);

        try {
            // Determine if this is a backend event (numeric id + priceTiers) or seed event
            const isBackendEvent = event?.priceTiers?.length > 0 && !isNaN(parseInt(event.id));

            if (isBackendEvent) {
                // Real backend booking
                let priceTierId = bookingData.priceTierId;
                if (!priceTierId && event.priceTiers.length > 0) {
                    priceTierId = event.priceTiers[0].id;
                }

                const backendPaymentMethod = PAYMENT_METHOD_MAP[paymentData.method] || 'CARD';
                const bookingPayload = {
                    eventId: parseInt(event.id),
                    priceTierId: parseInt(priceTierId),
                    numTickets: bookingData.quantity,
                    seatNumbers: bookingData.selectedSeats.length > 0
                        ? bookingData.selectedSeats.map(String)
                        : [],
                    paymentMethod: backendPaymentMethod,
                };

                const result = await bookingService.createBooking(bookingPayload);
                if (result.success) {
                    const bookingId = result.data?.data?.id || result.data?.id;
                    showSuccess('Booking confirmed! 🎉');
                    navigate(`/booking-confirmation/${bookingId}`);
                } else {
                    showError(result.error || 'Booking failed. Please try again.');
                }
            } else {
                // Simulated booking for seed/demo events — persist to localStorage
                await new Promise((r) => setTimeout(r, 1000));

                const backendPaymentMethod = PAYMENT_METHOD_MAP[paymentData.method] || 'CARD';
                const bookingRef = 'DEMO-' + Date.now().toString(36).toUpperCase();
                const flatPrice = parseFloat(event.price) || 0;
                const simulatedBooking = {
                    id: bookingRef,
                    bookingReference: bookingRef,
                    eventName: event.name || event.eventName || event.title || 'Event',
                    tierName: 'General Admission',
                    numTickets: bookingData.quantity,
                    totalAmount: flatPrice * bookingData.quantity,
                    paymentMethod: backendPaymentMethod,
                    bookingStatus: 'CONFIRMED',
                    bookedAt: new Date().toISOString(),
                    seatNumbers: [],
                };

                // Save to localStorage
                const existing = JSON.parse(localStorage.getItem('demoBookings') || '[]');
                existing.push(simulatedBooking);
                localStorage.setItem('demoBookings', JSON.stringify(existing));

                showSuccess('Booking confirmed! 🎉');
                navigate('/my-tickets');
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
                            className={`booking-step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
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
                            <SeatSelectionStep
                                event={event}
                                bookingData={bookingData}
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
                            currentStep={currentStep}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Step 1: Ticket selection — works with both priceTiers (API) and flat price (seed)
// ---------------------------------------------------------------------------
const SeatSelectionStep = ({ event, bookingData, onComplete }) => {
    const priceTiers = event?.priceTiers || [];
    const hasTiers = priceTiers.length > 0;
    const flatPrice = event?.price ?? 0;

    const [quantity, setQuantity] = useState(bookingData.quantity || 1);
    const [selectedTierId, setSelectedTierId] = useState(
        bookingData.priceTierId || (priceTiers[0]?.id ?? null)
    );

    const handleContinue = () => {
        const tierName = hasTiers
            ? priceTiers.find((t) => t.id === selectedTierId)?.tierName || 'General'
            : 'General';

        onComplete({
            quantity,
            priceTierId: selectedTierId,
            seatType: tierName,
        });
    };

    // Can continue if we have tiers and one is selected, OR if no tiers (seed event)
    const canContinue = hasTiers ? !!selectedTierId : true;

    return (
        <div className="seat-selection-step">
            <h2 className="form-title">Select Tickets</h2>
            <p className="form-subtitle">Choose your ticket type and quantity</p>

            {/* Price Tiers (API events) */}
            {hasTiers ? (
                <div className="tier-options">
                    {priceTiers.map((tier) => (
                        <button
                            key={tier.id}
                            onClick={() => setSelectedTierId(tier.id)}
                            className={`tier-card ${selectedTierId === tier.id ? 'selected' : ''}`}
                        >
                            <div className="tier-info">
                                <span className="tier-name">{tier.tierName}</span>
                                <span className="tier-available">{tier.availableSeats} seats left</span>
                            </div>
                            <span className="tier-price">
                                {parseFloat(tier.price) === 0 ? 'Free' : `₹${parseFloat(tier.price).toLocaleString('en-IN')}`}
                            </span>
                        </button>
                    ))}
                </div>
            ) : (
                /* Seed event — show flat price card */
                <div className="tier-options">
                    <div className="tier-card selected">
                        <div className="tier-info">
                            <span className="tier-name">General Admission</span>
                            <span className="tier-available">{event?.availableSeats || '—'} seats available</span>
                        </div>
                        <span className="tier-price">
                            {flatPrice === 0 ? 'Free' : `₹${parseFloat(flatPrice).toLocaleString('en-IN')}`}
                        </span>
                    </div>
                </div>
            )}

            {/* Quantity */}
            <div className="quantity-selector">
                <label className="form-label">Number of Tickets</label>
                <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                    <span className="qty-value">{quantity}</span>
                    <button className="qty-btn" onClick={() => setQuantity((q) => Math.min(10, q + 1))} disabled={quantity >= 10}>+</button>
                </div>
            </div>

            <div className="form-actions">
                <Button type="button" onClick={handleContinue} disabled={!canContinue}>
                    Continue to Details
                </Button>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Step 2: User Details Form
// ---------------------------------------------------------------------------
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
                        type="text" name="name" value={formData.name} onChange={handleChange}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Enter your full name"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="Enter your email"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="Enter your phone number"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-actions">
                    <Button variant="outline" onClick={onBack}>Back</Button>
                    <Button type="submit">Continue to Payment</Button>
                </div>
            </form>
        </div>
    );
};

export default BookingPage;
