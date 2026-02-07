import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Sparkles } from 'lucide-react';
import eventService from '../services/eventService';
import seedEvents from '../data/seedEvents';
import EventCard from '../components/events/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Chip from '../components/common/Chip';
import { trackPageView } from '../utils/analytics';

const EventsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [allEvents, setAllEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [showFilters, setShowFilters] = useState(false);

    // Updated categories to match seed event tags
    const categories = [
        'All',
        'Technical',
        'Gaming',
        'Startup',
        'Hackathon',
        'Business',
        'Recruitment',
        'Innovation'
    ];

    // Map event tags/categories to filter categories
    const mapEventToCategory = (event) => {
        const tags = event.tags || event.categories || [];
        const tagsLower = tags.map(t => t.toLowerCase());

        // Define mappings (case-insensitive)
        if (tagsLower.some(t => t.includes('ideathon') || t.includes('innovation') || t.includes('technical'))) {
            return 'Technical';
        }
        if (tagsLower.some(t => t.includes('gaming'))) {
            return 'Gaming';
        }
        if (tagsLower.some(t => t.includes('hackathon') || t.includes('no code'))) {
            return 'Hackathon';
        }
        if (tagsLower.some(t => t.includes('startup') || t.includes('pitch') || t.includes('investor'))) {
            return 'Startup';
        }
        if (tagsLower.some(t => t.includes('business') || t.includes('corporate'))) {
            return 'Business';
        }
        if (tagsLower.some(t => t.includes('recruitment') || t.includes('creatives'))) {
            return 'Recruitment';
        }

        return event.category || 'Technical'; // Fallback
    };

    useEffect(() => {
        trackPageView('Events');
        fetchEvents();
    }, []);

    useEffect(() => {
        // Apply filters whenever allEvents, searchQuery, or selectedCategory changes
        applyFilters();
    }, [allEvents, searchQuery, selectedCategory]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await eventService.getEvents({ size: 50 });
            const apiEvents = (response.success && (response.data.content || response.data)) || [];

            // Use API events if available, otherwise fallback to seed events
            const events = apiEvents.length > 0 ? apiEvents : seedEvents;
            setAllEvents(events);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            // On error, use seed events as fallback
            setAllEvents(seedEvents);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...allEvents];

        // Apply category filter
        if (selectedCategory && selectedCategory !== 'all') {
            filtered = filtered.filter(event => {
                const eventCategory = mapEventToCategory(event);
                return eventCategory.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
            });
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(event => {
                const name = (event.name || event.title || '').toLowerCase();
                const organizer = (event.organizerName || '').toLowerCase();
                const tags = (event.tags || event.categories || []).join(' ').toLowerCase();
                const venue = (event.venue || '').toLowerCase();

                return name.includes(query) ||
                    organizer.includes(query) ||
                    tags.includes(query) ||
                    venue.includes(query);
            });
        }

        setFilteredEvents(filtered);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const newParams = new URLSearchParams(searchParams);
        if (searchQuery.trim()) {
            newParams.set('search', searchQuery);
        } else {
            newParams.delete('search');
        }
        setSearchParams(newParams);
        applyFilters();
    };

    const handleCategoryClick = (category) => {
        const newCategory = category === selectedCategory ? '' : category;
        setSelectedCategory(newCategory);

        const newParams = new URLSearchParams(searchParams);
        if (newCategory && newCategory !== 'all') {
            newParams.set('category', newCategory.toLowerCase());
        } else {
            newParams.delete('category');
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSearchParams({});
    };

    const hasActiveFilters = searchQuery.trim() || selectedCategory;

    return (
        <div className="min-h-screen">
            {/* Hero Section with Background Video */}
            <section
                className="relative py-20 md:py-24 overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #03071E 0%, #370617 50%, #03071E 100%)',
                }}
            >
                {/* Background Video */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{
                        zIndex: 0,
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        perspective: 1000,
                        WebkitPerspective: 1000,
                        imageRendering: '-webkit-optimize-contrast',
                        filter: 'contrast(1.05) saturate(1.1)',
                    }}
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                >
                    <source src="/allred.mp4" type="video/mp4" />
                </video>

                {/* Quality optimization styles */}
                <style jsx>{`
                    video {
                        -webkit-transform: translateZ(0);
                        -webkit-backface-visibility: hidden;
                        -webkit-perspective: 1000;
                        will-change: transform;
                    }
                `}</style>

                {/* Dark Gradient Overlay for Readability */}
                <div
                    className="absolute inset-0"
                    style={{
                        zIndex: 1,
                        background: `
                            linear-gradient(
                                to bottom,
                                rgba(3, 7, 30, 0.30) 0%,
                                rgba(55, 6, 23, 0.25) 50%,
                                rgba(3, 7, 30, 0.45) 100%
                            )
                        `
                    }}
                />

                {/* Subtle warm accent glow */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        zIndex: 1,
                        background: 'radial-gradient(circle at 50% 50%, #FAA307 0%, transparent 70%)'
                    }}
                />

                {/* Hero Content */}
                <div className="container relative z-10" style={{ zIndex: 10 }}>
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles size={24} style={{ color: '#FFBA08' }} />
                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-warm-highlight to-teal-accent bg-clip-text text-transparent"
                                style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
                            >
                                Explore Events
                            </h1>
                            <Sparkles size={24} style={{ color: '#FFBA08' }} />
                        </div>
                        <p
                            className="text-text-secondary text-lg md:text-xl"
                            style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)' }}
                        >
                            Discover exciting events happening on campus
                        </p>
                    </div>
                </div>

                {/* Reduced motion support */}
                <style jsx>{`
                    @media (prefers-reduced-motion: reduce) {
                        video {
                            animation-play-state: paused !important;
                            opacity: 0;
                        }
                    }
                `}</style>
            </section>

            {/* Main Content with Search & Filters */}
            <div className="container py-12">
                {/* Search & Filter Bar - Separated with Glass Panel */}
                <div
                    className="mb-12 p-6 rounded-3xl"
                    style={{
                        background: 'rgba(55, 6, 23, 0.35)',
                        border: '1px solid rgba(255, 186, 8, 0.16)',
                        backdropFilter: 'blur(14px)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2"
                                        size={20}
                                        style={{ color: '#FAA307' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search events, organizers, tags..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-2xl text-text-primary placeholder-text-muted transition-all focus:outline-none"
                                        style={{
                                            background: 'rgba(55, 6, 23, 0.3)',
                                            border: '1px solid rgba(255, 186, 8, 0.18)',
                                            backdropFilter: 'blur(10px)',
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'rgba(255, 186, 8, 0.4)';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(255, 186, 8, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'rgba(255, 186, 8, 0.18)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>
                                <Button type="submit">Search</Button>
                            </div>
                        </form>

                        {/* Filter Toggle */}
                        <Button
                            variant="secondary"
                            onClick={() => setShowFilters(!showFilters)}
                            icon={<Filter size={18} />}
                            className="relative"
                        >
                            Filters
                            {selectedCategory && (
                                <span
                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                                    style={{ background: '#FFBA08', color: '#03071E' }}
                                >
                                    1
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Active Filters */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-text-secondary">Active filters:</span>
                            {searchQuery.trim() && (
                                <Chip
                                    variant="teal"
                                    onRemove={() => setSearchQuery('')}
                                >
                                    Search: "{searchQuery}"
                                </Chip>
                            )}
                            {selectedCategory && (
                                <Chip
                                    variant="teal"
                                    onRemove={() => handleCategoryClick(selectedCategory)}
                                >
                                    {selectedCategory}
                                </Chip>
                            )}
                            <button
                                onClick={clearFilters}
                                className="text-sm hover:text-warm-highlight transition-colors flex items-center gap-1 font-medium"
                                style={{ color: '#FAA307' }}
                            >
                                <X size={14} />
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* Filter Panel */}
                    {showFilters && (
                        <div
                            className="rounded-2xl p-6 space-y-6 animate-slideDown"
                            style={{
                                background: 'rgba(55, 6, 23, 0.35)',
                                border: '1px solid rgba(255, 186, 8, 0.18)',
                                backdropFilter: 'blur(14px)',
                            }}
                        >
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-semibold text-text-primary mb-3">
                                    Category
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat) => {
                                        const isSelected = cat === 'All'
                                            ? !selectedCategory
                                            : selectedCategory.toLowerCase() === cat.toLowerCase();

                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => handleCategoryClick(cat === 'All' ? '' : cat)}
                                                className="px-4 py-2 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
                                                style={isSelected ? {
                                                    background: 'linear-gradient(135deg, #F48C06, #D00000)',
                                                    color: '#FFFFFF',
                                                    boxShadow: '0 4px 14px rgba(255, 186, 8, 0.15)',
                                                    focusRingColor: '#FFBA08'
                                                } : {
                                                    background: 'rgba(55, 6, 23, 0.4)',
                                                    border: '1px solid rgba(255, 186, 8, 0.25)',
                                                    color: '#FAA307',
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isSelected) {
                                                        e.target.style.borderColor = 'rgba(255, 186, 8, 0.4)';
                                                        e.target.style.color = '#FFBA08';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isSelected) {
                                                        e.target.style.borderColor = 'rgba(255, 186, 8, 0.25)';
                                                        e.target.style.color = '#FAA307';
                                                    }
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* End of Search & Filter Glass Panel */}

                {/* Events Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredEvents.map((event, index) => (
                            <div
                                key={event.id}
                                className="animate-slideUp"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        className="text-center py-20 rounded-3xl"
                        style={{
                            background: 'rgba(55, 6, 23, 0.25)',
                            border: '1px solid rgba(255, 186, 8, 0.12)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <div className="max-w-md mx-auto space-y-4">
                            <div
                                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                                style={{
                                    background: 'rgba(55, 6, 23, 0.5)',
                                    border: '1px solid rgba(255, 186, 8, 0.2)',
                                }}
                            >
                                <Search size={40} style={{ color: '#FAA307' }} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">No events found</h3>
                            <p className="text-text-secondary">
                                {hasActiveFilters
                                    ? `No events match your current ${searchQuery ? 'search' : ''} ${searchQuery && selectedCategory ? 'and' : ''} ${selectedCategory ? 'filter' : ''}`
                                    : 'No events available at the moment'}
                            </p>
                            {hasActiveFilters && (
                                <Button onClick={clearFilters} variant="primary">
                                    Clear Filters & Show All Events
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsPage;
