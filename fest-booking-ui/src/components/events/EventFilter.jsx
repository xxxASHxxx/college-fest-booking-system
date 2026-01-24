import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { EVENT_CATEGORIES } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

const EventFilters = ({ onFilterChange, onReset }) => {
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        startDate: '',
        endDate: '',
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const emptyFilters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            startDate: '',
            endDate: '',
        };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
        if (onReset) onReset();
    };

    const activeFiltersCount = Object.values(filters).filter((val) => val !== '').length;

    return (
        <div className="space-y-4">
            {/* Search Bar & Filter Toggle */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <Input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        placeholder="Search events by name, venue..."
                        icon={<Search size={20} />}
                    />
                </div>

                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    icon={<Filter size={20} />}
                >
                    Filters
                    {activeFiltersCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-500 text-white text-xs">
              {activeFiltersCount}
            </span>
                    )}
                </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <Card className="p-6 space-y-6 animate-slideDown">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">
                            Category
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            <button
                                onClick={() => handleChange({ target: { name: 'category', value: '' } })}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    filters.category === ''
                                        ? 'backdrop-blur-lg bg-purple-500/80 border border-purple-400/30 text-white'
                                        : 'backdrop-blur-lg bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                                }`}
                            >
                                All
                            </button>
                            {EVENT_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => handleChange({ target: { name: 'category', value: cat.value } })}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                        filters.category === cat.value
                                            ? 'backdrop-blur-lg bg-purple-500/80 border border-purple-400/30 text-white'
                                            : 'backdrop-blur-lg bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                                    }`}
                                >
                                    {cat.icon} {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Min Price (₹)"
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleChange}
                            placeholder="0"
                            min="0"
                        />
                        <Input
                            label="Max Price (₹)"
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            placeholder="10000"
                            min="0"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleChange}
                        />
                        <Input
                            label="End Date"
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            icon={<X size={18} />}
                            fullWidth
                        >
                            Clear All
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => setShowFilters(false)}
                            fullWidth
                        >
                            Apply Filters
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default EventFilters;
