import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import eventService from '../services/eventService';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import { trackPageView } from '../utils/analytics';
import { FiFilter } from 'react-icons/fi';
import './EventsPage.css';

const EventsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        status: searchParams.get('status') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        sortBy: searchParams.get('sortBy') || 'date',
        sortOrder: searchParams.get('sortOrder') || 'asc',
    });

    useEffect(() => {
        trackPageView('Events');
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [filters, currentPage]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const result = await eventService.getEvents({
                ...filters,
                page: currentPage,
                size: 12,
            });

            if (result.success) {
                setEvents(result.data.content || result.data);
                setTotalPages(result.data.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(0);

        // Update URL params
        const params = {};
        Object.keys(newFilters).forEach((key) => {
            if (newFilters[key]) {
                params[key] = newFilters[key];
            }
        });
        setSearchParams(params);
    };

    const handleSearch = (query) => {
        handleFilterChange({ ...filters, search: query });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="events-page">
            <div className="events-container">
                {/* Header */}
                <div className="events-header">
                    <div className="events-header-content">
                        <h1 className="events-title">Discover Events</h1>
                        <p className="events-subtitle">
                            Find and book tickets for amazing events on campus
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="events-search">
                        <SearchBar
                            placeholder="Search events..."
                            value={filters.search}
                            onSearch={handleSearch}
                            size="large"
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="events-content">
                    {/* Filters Sidebar */}
                    <aside className={`events-filters ${showFilters ? 'show' : ''}`}>
                        <div className="filters-header">
                            <h3>Filters</h3>
                            <button
                                className="filters-close"
                                onClick={() => setShowFilters(false)}
                            >
                                ×
                            </button>
                        </div>
                        <EventFilters
                            filters={filters}
                            onChange={handleFilterChange}
                        />
                    </aside>

                    {/* Events Grid */}
                    <div className="events-main">
                        {/* Toolbar */}
                        <div className="events-toolbar">
                            <button
                                className="filter-toggle-btn"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FiFilter /> Filters
                            </button>

                            <div className="events-count">
                                {loading ? 'Loading...' : `${events.length} events found`}
                            </div>

                            <select
                                className="sort-select"
                                value={`${filters.sortBy}-${filters.sortOrder}`}
                                onChange={(e) => {
                                    const [sortBy, sortOrder] = e.target.value.split('-');
                                    handleFilterChange({ ...filters, sortBy, sortOrder });
                                }}
                            >
                                <option value="date-asc">Date (Earliest First)</option>
                                <option value="date-desc">Date (Latest First)</option>
                                <option value="price-asc">Price (Low to High)</option>
                                <option value="price-desc">Price (High to Low)</option>
                                <option value="name-asc">Name (A-Z)</option>
                                <option value="name-desc">Name (Z-A)</option>
                            </select>
                        </div>

                        {/* Events List */}
                        {loading ? (
                            <div className="events-loading">
                                <LoadingSpinner size="large" />
                            </div>
                        ) : events.length > 0 ? (
                            <>
                                <div className="events-grid">
                                    {events.map((event) => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </>
                        ) : (
                            <EmptyState
                                icon="🎪"
                                title="No events found"
                                description="Try adjusting your filters or search query"
                                action={{
                                    label: 'Clear Filters',
                                    onClick: () => handleFilterChange({
                                        search: '',
                                        category: '',
                                        status: '',
                                        minPrice: '',
                                        maxPrice: '',
                                        startDate: '',
                                        endDate: '',
                                        sortBy: 'date',
                                        sortOrder: 'asc',
                                    }),
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Backdrop for Mobile */}
            {showFilters && (
                <div
                    className="filters-backdrop"
                    onClick={() => setShowFilters(false)}
                />
            )}
        </div>
    );
};

export default EventsPage;
