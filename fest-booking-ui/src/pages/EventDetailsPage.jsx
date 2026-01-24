import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useCart } from '../hooks/useCart';
import eventService from '../services/eventService';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import { FiCalendar, FiMapPin, FiClock, FiUser, FiShare2, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { formatDate, formatTime, formatCurrency } from '../utils/formatters';
import { trackPageView, trackButtonClick } from '../utils/analytics';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { showSuccess, showError } = useToast();
    const { addItem, isInCart } = useCart();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    useEffect(() => {
        if (event) {
            trackPageView('Event Details', { eventId: event.id, eventName: event.name });
        }
    }, [event]);

    const fetchEventDetails = async () => {
        setLoading(true);
        try {
            const result = await eventService.getEventById(id);
            if (result.success) {
                setEvent(result.data);
            } else {
                showError('Failed to load event details');
                navigate('/events');
            }
        } catch (error) {
            showError('Failed to load event details');
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/events/${id}` } });
            return;
        }

        trackButtonClick('book_now', 'event_details');
        navigate(`/booking/${id}`, { state: { event, quantity: selectedQuantity } });
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/events/${id}` } });
            return;
        }

        addItem(event, selectedQuantity);
        showSuccess('Added to cart!');
        trackButtonClick('add_to_cart', 'event_details');
    };

    const handleShare = async () => {
        const shareData = {
            title: event.name,
            text: `Check out ${event.name} on FestBook!`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                trackButtonClick('share', 'event_details');
            } catch (error) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            showSuccess('Link copied to clipboard!');
        }
    };

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
        showSuccess(isFavorite ? 'Removed from favorites' : 'Added to favorites');
        trackButtonClick('toggle_favorite', 'event_details');
    };

    if (loading) {
        return (
            <div className="event-details-loading">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (!event) {
        return null;
    }

    const isAvailable = event.availableSeats > 0;
    const isSoldOut = event.availableSeats === 0;

    return (
        <div className="event-details-page">
            {/* Hero Section */}
            <div className="event-hero">
                <div className="event-hero-image">
                    <img src={event.image || '/images/placeholder-event.jpg'} alt={event.name} />
                    <div className="event-hero-overlay">
                        <div className="event-hero-actions">
                            <button className="hero-action-btn" onClick={handleShare}>
                                <FiShare2 /> Share
                            </button>
                            <button
                                className={`hero-action-btn ${isFavorite ? 'active' : ''}`}
                                onClick={handleToggleFavorite}
                            >
                                <FiHeart fill={isFavorite ? 'currentColor' : 'none'} />
                                {isFavorite ? 'Saved' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="event-details-container">
                <div className="event-details-content">
                    {/* Main Info */}
                    <div className="event-main-info">
                        <div className="event-header">
                            <div className="event-badges">
                                <Badge variant={event.category}>{event.category}</Badge>
                                {event.featured && <Badge variant="warning">Featured</Badge>}
                                {isSoldOut && <Badge variant="danger">Sold Out</Badge>}
                            </div>

                            <h1 className="event-title">{event.name}</h1>

                            <div className="event-meta">
                                <div className="meta-item">
                                    <FiCalendar />
                                    <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="meta-item">
                                    <FiClock />
                                    <span>{formatTime(event.date)}</span>
                                </div>
                                <div className="meta-item">
                                    <FiMapPin />
                                    <span>{event.venue}</span>
                                </div>
                                {event.organizer && (
                                    <div className="meta-item">
                                        <FiUser />
                                        <span>by {event.organizer}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="event-section">
                            <h2 className="section-title">About This Event</h2>
                            <p className="event-description">{event.description}</p>
                        </div>

                        {/* Details */}
                        {event.details && (
                            <div className="event-section">
                                <h2 className="section-title">Event Details</h2>
                                <div className="event-details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Duration</span>
                                        <span className="detail-value">{event.duration || '2-3 hours'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Category</span>
                                        <span className="detail-value">{event.category}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Total Seats</span>
                                        <span className="detail-value">{event.totalSeats}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Available Seats</span>
                                        <span className="detail-value">{event.availableSeats}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        <div className="event-section">
                            <h2 className="section-title">Location</h2>
                            <div className="event-location">
                                <FiMapPin className="location-icon" />
                                <div>
                                    <p className="location-venue">{event.venue}</p>
                                    {event.address && (
                                        <p className="location-address">{event.address}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        {event.terms && (
                            <div className="event-section">
                                <h2 className="section-title">Terms & Conditions</h2>
                                <ul className="event-terms">
                                    {event.terms.split('\n').map((term, index) => (
                                        <li key={index}>{term}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Booking Card */}
                    <div className="event-booking-card">
                        <div className="booking-card-content">
                            <div className="booking-price">
                                <span className="price-label">Price</span>
                                <span className="price-value">{formatCurrency(event.price)}</span>
                                <span className="price-note">per ticket</span>
                            </div>

                            {isAvailable && (
                                <div className="booking-quantity">
                                    <label className="quantity-label">Quantity</label>
                                    <div className="quantity-selector">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                                            disabled={selectedQuantity <= 1}
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={selectedQuantity}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 1;
                                                setSelectedQuantity(Math.max(1, Math.min(val, event.availableSeats)));
                                            }}
                                            className="quantity-input"
                                            min="1"
                                            max={event.availableSeats}
                                        />
                                        <button
                                            className="quantity-btn"
                                            onClick={() => setSelectedQuantity(Math.min(event.availableSeats, selectedQuantity + 1))}
                                            disabled={selectedQuantity >= event.availableSeats}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="booking-total">
                                <span>Total</span>
                                <span className="total-amount">
                  {formatCurrency(event.price * selectedQuantity)}
                </span>
                            </div>

                            <div className="booking-actions">
                                {isAvailable ? (
                                    <>
                                        <Button
                                            size="large"
                                            fullWidth
                                            onClick={handleBookNow}
                                        >
                                            Book Now
                                        </Button>
                                        {!isInCart(event.id) && (
                                            <Button
                                                size="large"
                                                variant="outline"
                                                fullWidth
                                                icon={<FiShoppingCart />}
                                                onClick={handleAddToCart}
                                            >
                                                Add to Cart
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <Button
                                        size="large"
                                        fullWidth
                                        disabled
                                    >
                                        Sold Out
                                    </Button>
                                )}
                            </div>

                            {isAvailable && (
                                <div className="booking-info">
                                    <p className="info-text">
                                        🎫 Only {event.availableSeats} tickets left!
                                    </p>
                                    <p className="info-text">
                                        ✅ Instant confirmation
                                    </p>
                                    <p className="info-text">
                                        🔒 Secure payment
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;
