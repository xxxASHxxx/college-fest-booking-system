import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useCart } from '../hooks/useCart';
import eventService from '../services/eventService';
import seedEvents from '../data/seedEvents';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';
import {
    FiCalendar,
    FiMapPin,
    FiClock,
    FiUser,
    FiShare2,
    FiHeart,
    FiUsers,
    FiTag,
    FiShoppingCart,
} from 'react-icons/fi';
import { formatDate, formatTime, formatCurrency } from '../utils/formatters';
import { trackPageView, trackButtonClick } from '../utils/analytics';
import './EventDetailsPage.css';

// ---------------------------------------------------------------------------
// Normalize event data from either seed format or API format into one shape
// ---------------------------------------------------------------------------
const normalizeEvent = (raw) => {
    if (!raw) return null;
    return {
        id: raw.id,
        name: raw.eventName || raw.name || raw.title || 'Untitled Event',
        description: raw.description || '',
        image: raw.bannerImageUrl || raw.coverImage || raw.image || '/images/placeholder-event.jpg',
        date: raw.eventDate || raw.date || raw.dateStart || null,
        dateStart: raw.dateStart,
        dateEnd: raw.dateEnd,
        timeStart: raw.timeStart,
        timeEnd: raw.timeEnd,
        venueName: typeof raw.venue === 'object'
            ? (raw.venue?.venueName || raw.venue?.name || '—')
            : (raw.venue || '—'),
        venueAddress: typeof raw.venue === 'object'
            ? (raw.venue?.address || '')
            : '',
        organizer: raw.organizerName || raw.organizer || '',
        organizerLogo: raw.organizerLogo || '',
        category: raw.eventType || raw.category || '',
        totalSeats: raw.maxCapacity || raw.totalSeats || 0,
        availableSeats: raw.availableSeats || 0,
        durationMinutes: raw.durationMinutes || null,
        priceTiers: raw.priceTiers || [],
        price: raw.price,
        status: raw.status || 'BOOKING_OPEN',
        tags: raw.tags || raw.categories || [],
        highlights: raw.highlights || [],
        featured: raw.featured || false,
        _raw: raw,
    };
};

const getMinPrice = (ev) => {
    if (ev.priceTiers && ev.priceTiers.length > 0) {
        return Math.min(...ev.priceTiers.map((t) => parseFloat(t.price)));
    }
    if (ev.price !== undefined && ev.price !== null) return parseFloat(ev.price);
    return null;
};

const fmtPrice = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return 'Free';
    if (amount === 0) return 'Free';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(amount);
};

// Parse seed-style date (DD-MM-YY) → human readable
const fmtSeedDate = (dateStart, dateEnd) => {
    const getMonthName = (m) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[parseInt(m) - 1] || '';
    };
    if (!dateStart) return null;
    const [d1, m1, y1] = dateStart.split('-');
    if (dateEnd && dateEnd !== dateStart) {
        const [d2, m2, y2] = dateEnd.split('-');
        if (m1 === m2 && y1 === y2) return `${d1}–${d2} ${getMonthName(m1)} '${y1}`;
        return `${d1} ${getMonthName(m1)} – ${d2} ${getMonthName(m2)} '${y2}`;
    }
    return `${d1} ${getMonthName(m1)} '${y1}`;
};

const EventDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { showSuccess, showError } = useToast();
    const { addItem, isInCart } = useCart();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTierId, setSelectedTierId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    useEffect(() => {
        if (event) {
            trackPageView('Event Details', { eventId: event.id, eventName: event.name });
            if (event.priceTiers && event.priceTiers.length > 0) {
                setSelectedTierId(event.priceTiers[0].id);
            }
        }
    }, [event]);

    const fetchEventDetails = async () => {
        setLoading(true);
        try {
            // Try backend API first
            const result = await eventService.getEventById(id);
            if (result.success) {
                const raw = result.data?.data || result.data;
                setEvent(normalizeEvent(raw));
                setLoading(false);
                return;
            }
        } catch (_) { /* API failed – fall through to seed data */ }

        // Fallback: look up seed events by ID
        const seedEvent = seedEvents.find((e) => String(e.id) === String(id));
        if (seedEvent) {
            setEvent(normalizeEvent(seedEvent));
        } else {
            showError('Event not found');
            navigate('/events');
        }
        setLoading(false);
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/events/${id}` } });
            return;
        }
        trackButtonClick('book_now', 'event_details');
        navigate(`/booking/${id}`, {
            state: { event: event._raw, priceTierId: selectedTierId, quantity },
        });
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/events/${id}` } });
            return;
        }
        addItem(event._raw, quantity);
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
            try { await navigator.share(shareData); } catch (_) { }
        } else {
            navigator.clipboard.writeText(window.location.href);
            showSuccess('Link copied to clipboard!');
        }
    };

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
        showSuccess(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
    };

    // -----------------------------------------------------------------------
    if (loading) {
        return (
            <div className="event-details-loading">
                <LoadingSpinner size="large" />
            </div>
        );
    }
    if (!event) return null;

    // Derived
    const minPrice = getMinPrice(event);
    const isFree = minPrice === 0 || minPrice === null;
    const isOpen = event.status === 'BOOKING_OPEN' || !event.status || event.status === 'UPCOMING';
    const isSoldOut = event.status === 'SOLD_OUT' || event.availableSeats === 0;
    const selectedTier = event.priceTiers?.find((t) => t.id === selectedTierId);
    const tierPrice = selectedTier ? parseFloat(selectedTier.price) : (event.price || 0);
    const totalAmount = tierPrice * quantity;
    const maxQty = selectedTier?.availableSeats || event.availableSeats || 10;

    // Date display — try seed format first, then ISO
    const dateDisplay = fmtSeedDate(event.dateStart, event.dateEnd) || formatDate(event.date);
    const timeDisplay = event.timeStart
        ? `${event.timeStart}${event.timeEnd && event.timeEnd !== event.timeStart ? ' – ' + event.timeEnd : ''}`
        : formatTime(event.date);

    return (
        <div className="event-details-page">
            {/* Hero */}
            <div className="event-hero">
                <div className="event-hero-image">
                    <img src={event.image} alt={event.name} />
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
                                {event.category && <Badge variant="primary">{event.category}</Badge>}
                                {event.featured && <Badge variant="warning">Featured</Badge>}
                                {isSoldOut && <Badge variant="danger">Sold Out</Badge>}
                                {isFree && <Badge variant="success">Free</Badge>}
                            </div>

                            <h1 className="event-title">{event.name}</h1>

                            <div className="event-meta">
                                {dateDisplay && (
                                    <div className="meta-item">
                                        <FiCalendar />
                                        <span>{dateDisplay}</span>
                                    </div>
                                )}
                                {timeDisplay && (
                                    <div className="meta-item">
                                        <FiClock />
                                        <span>{timeDisplay}</span>
                                    </div>
                                )}
                                <div className="meta-item">
                                    <FiMapPin />
                                    <span>{event.venueName}</span>
                                </div>
                                {event.organizer && (
                                    <div className="meta-item">
                                        <FiUser />
                                        <span>by {event.organizer}</span>
                                    </div>
                                )}
                                {event.availableSeats > 0 && (
                                    <div className="meta-item">
                                        <FiUsers />
                                        <span>{event.availableSeats} seats available</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="event-section">
                            <h2 className="section-title">About This Event</h2>
                            <p className="event-description">
                                {event.description || 'No description available.'}
                            </p>
                        </div>

                        {/* Highlights */}
                        {event.highlights && event.highlights.length > 0 && (
                            <div className="event-section">
                                <h2 className="section-title">Highlights</h2>
                                <div className="event-badges">
                                    {event.highlights.map((h, i) => (
                                        <Badge key={i} variant="warning">{h}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price Tiers (API events) */}
                        {event.priceTiers && event.priceTiers.length > 0 && (
                            <div className="event-section">
                                <h2 className="section-title">Ticket Tiers</h2>
                                <div className="tier-list">
                                    {event.priceTiers.map((tier) => (
                                        <div key={tier.id} className="tier-row">
                                            <div className="tier-row-info">
                                                <FiTag className="tier-icon" />
                                                <span className="tier-row-name">{tier.tierName}</span>
                                                {tier.availableSeats !== undefined && (
                                                    <span className="tier-row-seats">{tier.availableSeats} left</span>
                                                )}
                                            </div>
                                            <span className="tier-row-price">
                                                {tier.price == 0 ? 'Free' : fmtPrice(tier.price)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        <div className="event-section">
                            <h2 className="section-title">Location</h2>
                            <div className="event-location">
                                <FiMapPin className="location-icon" />
                                <div>
                                    <p className="location-venue">{event.venueName}</p>
                                    {event.venueAddress && (
                                        <p className="location-address">{event.venueAddress}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                            <div className="event-section">
                                <h2 className="section-title">Tags</h2>
                                <div className="event-badges">
                                    {event.tags.map((tag, i) => (
                                        <Badge key={i} variant="primary">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Card */}
                    <div className="event-booking-card">
                        <div className="booking-card-content">
                            <div className="booking-price">
                                <span className="price-label">{isFree ? 'Entry' : 'Starting from'}</span>
                                <span className="price-value">{isFree ? 'Free' : fmtPrice(minPrice)}</span>
                                {!isFree && <span className="price-note">per ticket</span>}
                            </div>

                            {/* Tier Selector (API events) */}
                            {!isSoldOut && isOpen && event.priceTiers.length > 0 && (
                                <div className="booking-tier-selector">
                                    <label className="quantity-label">Select Tier</label>
                                    <div className="tier-select-list">
                                        {event.priceTiers.map((tier) => (
                                            <button
                                                key={tier.id}
                                                className={`tier-select-btn ${selectedTierId === tier.id ? 'selected' : ''}`}
                                                onClick={() => setSelectedTierId(tier.id)}
                                                disabled={tier.availableSeats === 0}
                                            >
                                                <span>{tier.tierName}</span>
                                                <span>{tier.price == 0 ? 'Free' : fmtPrice(tier.price)}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            {!isSoldOut && isOpen && (
                                <div className="booking-quantity">
                                    <label className="quantity-label">Quantity</label>
                                    <div className="quantity-selector">
                                        <button className="quantity-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>−</button>
                                        <input
                                            type="number" value={quantity} className="quantity-input" min="1" max={maxQty}
                                            onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, maxQty)))}
                                        />
                                        <button className="quantity-btn" onClick={() => setQuantity(Math.min(maxQty, quantity + 1))} disabled={quantity >= maxQty}>+</button>
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            {!isSoldOut && isOpen && totalAmount > 0 && (
                                <div className="booking-total">
                                    <span>Total</span>
                                    <span className="total-amount">{fmtPrice(totalAmount)}</span>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="booking-actions">
                                {isSoldOut ? (
                                    <Button size="large" fullWidth disabled>Sold Out</Button>
                                ) : isOpen ? (
                                    <>
                                        <Button size="large" fullWidth onClick={handleBookNow}>
                                            Book Now
                                        </Button>
                                        {!isInCart(event.id) && (
                                            <Button size="large" variant="outline" fullWidth icon={<FiShoppingCart />} onClick={handleAddToCart}>
                                                Add to Cart
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <Button size="large" fullWidth disabled>Booking Closed</Button>
                                )}
                            </div>

                            {!isSoldOut && isOpen && (
                                <div className="booking-info">
                                    <p className="info-text">✅ Instant confirmation</p>
                                    <p className="info-text">🔒 Secure booking</p>
                                    {event.availableSeats > 0 && event.availableSeats <= 20 && (
                                        <p className="info-text">🎫 Only {event.availableSeats} tickets left!</p>
                                    )}
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
