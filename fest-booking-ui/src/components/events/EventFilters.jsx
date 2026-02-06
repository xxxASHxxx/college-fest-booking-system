import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SearchBar from '../common/SearchBar';
import Badge from '../common/Badge';
import './EventFilters.css';

const EventFilters = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        date: '',
        priceRange: '',
        status: '',
    });

    const handleChange = (name, value) => {
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    const clearFilters = () => {
        const emptyFilters = {
            search: '',
            category: '',
            date: '',
            priceRange: '',
            status: '',
        };
        setFilters(emptyFilters);
        if (onFilterChange) {
            onFilterChange(emptyFilters);
        }
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== '');

    return (
        <div className="event-filters">
            <div className="filter-header">
                <h3>Filters</h3>
                {hasActiveFilters && (
                    <button onClick={clearFilters} className="clear-filters">
                        Clear All
                    </button>
                )}
            </div>

            <div className="filter-section">
                <label>Search</label>
                <SearchBar
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                    placeholder="Search events..."
                />
            </div>

            <div className="filter-section">
                <label>Category</label>
                <select
                    value={filters.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Categories</option>
                    <option value="music">🎵 Music</option>
                    <option value="tech">💻 Tech</option>
                    <option value="sports">⚽ Sports</option>
                    <option value="cultural">🎭 Cultural</option>
                    <option value="workshop">🛠️ Workshop</option>
                    <option value="art">🎨 Art</option>
                </select>
            </div>

            <div className="filter-section">
                <label>Date</label>
                <select
                    value={filters.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="filter-select"
                >
                    <option value="">Any Date</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                    <option value="next-month">Next Month</option>
                </select>
            </div>

            <div className="filter-section">
                <label>Price Range</label>
                <select
                    value={filters.priceRange}
                    onChange={(e) => handleChange('priceRange', e.target.value)}
                    className="filter-select"
                >
                    <option value="">Any Price</option>
                    <option value="free">Free</option>
                    <option value="0-500">₹0 - ₹500</option>
                    <option value="500-1000">₹500 - ₹1000</option>
                    <option value="1000-2000">₹1000 - ₹2000</option>
                    <option value="2000+">₹2000+</option>
                </select>
            </div>

            <div className="filter-section">
                <label>Status</label>
                <div className="status-badges">
                    <button
                        className={`status-badge ${filters.status === 'upcoming' ? 'active' : ''}`}
                        onClick={() => handleChange('status', filters.status === 'upcoming' ? '' : 'upcoming')}
                    >
                        <Badge variant="info">Upcoming</Badge>
                    </button>
                    <button
                        className={`status-badge ${filters.status === 'ongoing' ? 'active' : ''}`}
                        onClick={() => handleChange('status', filters.status === 'ongoing' ? '' : 'ongoing')}
                    >
                        <Badge variant="success">Ongoing</Badge>
                    </button>
                </div>
            </div>
        </div>
    );
};

EventFilters.propTypes = {
    onFilterChange: PropTypes.func,
};

export default EventFilters;
