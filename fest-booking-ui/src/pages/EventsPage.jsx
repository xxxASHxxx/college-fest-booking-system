import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Tag, X } from 'lucide-react';
import eventService from '../services/eventService';
import EventCard from '../components/events/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Chip from '../components/common/Chip';
import Input from '../components/common/Input';
import { trackPageView } from '../utils/analytics';

const EventsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        status: searchParams.get('status') || '',
    });
    const [showFilters, setShowFilters] = useState(false);

    const categories = ['Music', 'Tech', 'Sports', 'Cultural', 'Workshop', 'Competition'];
    const statuses = [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'This Week', value: 'this_week' },
        { label: 'This Month', value: 'this_month' },
    ];

    useEffect(() => {
        trackPageView('Events');
        fetchEvents();
    }, [searchParams]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = {
                search: searchParams.get('search') || undefined,
                category: searchParams.get('category') || undefined,
                status: searchParams.get('status') || 'upcoming',
                size: 20,
            };

            const response = await eventService.getEvents(params);
            if (response.success) {
                setEvents(response.data.content || response.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const newParams = new URLSearchParams(searchParams);
        if (filters.search) {
            newParams.set('search', filters.search);
        } else {
            newParams.delete('search');
        }
        setSearchParams(newParams);
    };

    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setSearchParams({});
        setFilters({ search: '', category: '', status: '' });
    };

    const activeFiltersCount = [filters.category, filters.status].filter(Boolean).length;

    return (
        <div className="min-h-screen py-8">
            <div className="container">
                {/* Header */}
                <div className="mb-8 space-y-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">Explore Events</h1>
                        <p className="text-text-secondary text-lg">
                            Discover exciting events happening on campus
                        </p>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search events..."
                                        value={filters.search}
                                        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                                        className="w-full pl-10 pr-4 py-3 bg-bg-card border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-teal-accent focus:border-teal-accent transition-all"
                                    />
                                </div>
                                <Button type="submit">Search</Button>
                            </div>
                        </form>

                        {/* Filter Toggle */}
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            icon={<Filter size={18} />}
                            className="relative"
                        >
                            Filters
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-accent rounded-full text-xs flex items-center justify-center text-white">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Active Filters */}
                    {(filters.category || filters.status) && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-text-secondary">Active filters:</span>
                            {filters.category && (
                                <Chip
                                    variant="teal"
                                    onRemove={() => handleFilterChange('category', '')}
                                >
                                    {filters.category}
                                </Chip>
                            )}
                            {filters.status && (
                                <Chip
                                    variant="teal"
                                    onRemove={() => handleFilterChange('status', '')}
                                >
                                    {statuses.find((s) => s.value === filters.status)?.label || filters.status}
                                </Chip>
                            )}
                            <button
                                onClick={clearFilters}
                                className="text-sm text-text-muted hover:text-error transition-colors flex items-center gap-1"
                            >
                                <X size={14} />
                                Clear all
                            </button>
                        </div>
                    )}

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="bg-bg-card border border-border rounded-2xl p-6 space-y-6 animate-slideDown">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-3">
                                    Category
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => handleFilterChange('category', filters.category === cat.toLowerCase() ? '' : cat.toLowerCase())}
                                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filters.category === cat.toLowerCase()
                                                ? 'bg-teal-accent text-white shadow-glow-accent'
                                                : 'bg-bg-input border border-border text-text-secondary hover:border-teal-accent hover:text-teal-accent'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Filter */}
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-3">
                                    When
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {statuses.map((status) => (
                                        <button
                                            key={status.value}
                                            onClick={() => handleFilterChange('status', filters.status === status.value ? '' : status.value)}
                                            className={`px-4 py-2 rounded-xl font-medium transition-all ${filters.status === status.value
                                                ? 'bg-teal-accent text-white shadow-glow-accent'
                                                : 'bg-bg-input border border-border text-text-secondary hover:border-teal-accent hover:text-teal-accent'
                                                }`}
                                        >
                                            {status.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Events Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event, index) => (
                            <div key={event.id} className="animate-slideUp" style={{ animationDelay: `${index * 50}ms` }}>
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="w-20 h-20 mx-auto bg-bg-card rounded-full flex items-center justify-center">
                                <Search className="text-text-muted" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold">No events found</h3>
                            <p className="text-text-secondary">
                                Try adjusting your filters or search query
                            </p>
                            <Button onClick={clearFilters} variant="outline">
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsPage;
