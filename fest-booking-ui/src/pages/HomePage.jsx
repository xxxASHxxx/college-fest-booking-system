import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCalendar, FiMapPin, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import eventService from '../services/eventService';
import Button from '../components/common/Button';
import EventCard from '../components/events/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { trackPageView } from '../utils/analytics';
import './HomePage.css';

const HomePage = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        trackPageView('Home');
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const [featuredRes, upcomingRes] = await Promise.all([
                eventService.getEvents({ featured: true, size: 6 }),
                eventService.getEvents({ status: 'upcoming', size: 8 }),
            ]);

            if (featuredRes.success) {
                setFeaturedEvents(featuredRes.data.content || featuredRes.data);
            }

            if (upcomingRes.success) {
                setUpcomingEvents(upcomingRes.data.content || upcomingRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Discover Amazing
                            <span className="gradient-text"> College Events</span>
                        </h1>
                        <p className="hero-description">
                            Book tickets for the hottest events on campus. From cultural fests to tech symposiums,
                            find and book your favorite events in just a few clicks.
                        </p>

                        {/* Search Bar */}
                        <form className="hero-search" onSubmit={handleSearch}>
                            <div className="search-input-wrapper">
                                <FiSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search for events, artists, venues..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <Button type="submit" size="large">
                                Search
                            </Button>
                        </form>

                        {/* Quick Filters */}
                        <div className="quick-filters">
                            <button
                                className="quick-filter-btn"
                                onClick={() => navigate('/events?category=music')}
                            >
                                <span>🎵</span> Music
                            </button>
                            <button
                                className="quick-filter-btn"
                                onClick={() => navigate('/events?category=tech')}
                            >
                                <span>💻</span> Tech
                            </button>
                            <button
                                className="quick-filter-btn"
                                onClick={() => navigate('/events?category=sports')}
                            >
                                <span>⚽</span> Sports
                            </button>
                            <button
                                className="quick-filter-btn"
                                onClick={() => navigate('/events?category=cultural')}
                            >
                                <span>🎪</span> Cultural
                            </button>
                        </div>
                    </div>

                    <div className="hero-image">
                        <div className="hero-image-card">
                            <img
                                src="/images/hero-illustration.svg"
                                alt="Event Illustration"
                                className="hero-img"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">🎉</div>
                            <div className="stat-value">500+</div>
                            <div className="stat-label">Events Hosted</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🎫</div>
                            <div className="stat-value">50K+</div>
                            <div className="stat-label">Tickets Sold</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-value">10K+</div>
                            <div className="stat-label">Happy Users</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⭐</div>
                            <div className="stat-value">4.9/5</div>
                            <div className="stat-label">User Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Events */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Featured Events</h2>
                            <p className="section-subtitle">Don't miss these amazing events</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/events')}
                            icon={<FiArrowRight />}
                            iconPosition="right"
                        >
                            View All
                        </Button>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <LoadingSpinner size="large" />
                        </div>
                    ) : (
                        <div className="events-grid">
                            {featuredEvents.map((event) => (
                                <EventCard key={event.id} event={event} featured />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Upcoming Events */}
            <section className="upcoming-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Upcoming Events</h2>
                            <p className="section-subtitle">Mark your calendar for these events</p>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/events?status=upcoming')}
                            icon={<FiCalendar />}
                            iconPosition="right"
                        >
                            See All Upcoming
                        </Button>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <LoadingSpinner size="large" />
                        </div>
                    ) : (
                        <div className="events-grid">
                            {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Browse by Category</h2>
                            <p className="section-subtitle">Find events that match your interests</p>
                        </div>
                    </div>

                    <div className="categories-grid">
                        {[
                            { id: 'music', name: 'Music', icon: '🎵', color: '#FF6B9D' },
                            { id: 'dance', name: 'Dance', icon: '💃', color: '#C44569' },
                            { id: 'drama', name: 'Drama', icon: '🎭', color: '#FFA07A' },
                            { id: 'sports', name: 'Sports', icon: '⚽', color: '#4ECDC4' },
                            { id: 'tech', name: 'Tech', icon: '💻', color: '#5F27CD' },
                            { id: 'art', name: 'Art', icon: '🎨', color: '#00B894' },
                            { id: 'cultural', name: 'Cultural', icon: '🎪', color: '#FDCB6E' },
                            { id: 'workshop', name: 'Workshop', icon: '🛠️', color: '#6C5CE7' },
                        ].map((category) => (
                            <button
                                key={category.id}
                                className="category-card"
                                onClick={() => navigate(`/events?category=${category.id}`)}
                                style={{ '--category-color': category.color }}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-name">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header centered">
                        <div>
                            <h2 className="section-title">Why Choose FestBook?</h2>
                            <p className="section-subtitle">The best platform for college event bookings</p>
                        </div>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FiCalendar />
                            </div>
                            <h3 className="feature-title">Easy Booking</h3>
                            <p className="feature-description">
                                Book tickets in seconds with our simple and intuitive interface
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FiMapPin />
                            </div>
                            <h3 className="feature-title">Local Events</h3>
                            <p className="feature-description">
                                Discover events happening right on your campus
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FiTrendingUp />
                            </div>
                            <h3 className="feature-title">Real-time Updates</h3>
                            <p className="feature-description">
                                Get instant notifications about event updates and new releases
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🎫</div>
                            <h3 className="feature-title">Digital Tickets</h3>
                            <p className="feature-description">
                                Access your tickets anytime with our digital ticket system
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">💳</div>
                            <h3 className="feature-title">Secure Payments</h3>
                            <p className="feature-description">
                                Multiple payment options with bank-level security
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3 className="feature-title">Mobile Friendly</h3>
                            <p className="feature-description">
                                Book and manage tickets on the go with our mobile-optimized platform
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Experience Amazing Events?</h2>
                        <p className="cta-description">
                            Join thousands of students who trust FestBook for their event bookings
                        </p>
                        <div className="cta-buttons">
                            <Button size="large" onClick={() => navigate('/events')}>
                                Browse Events
                            </Button>
                            <Button
                                size="large"
                                variant="outline"
                                onClick={() => navigate('/register')}
                            >
                                Sign Up Free
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
