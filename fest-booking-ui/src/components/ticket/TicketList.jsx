import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import TicketCard from './TicketCard';
import Button from '../common/Button';
import Loader from '../common/Loader';

const TicketList = ({ tickets, loading, onFilterChange }) => {
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = [
        { value: 'all', label: 'All Tickets' },
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'past', label: 'Past' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        if (onFilterChange) {
            onFilterChange(filter);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                    <div
                        key={index}
                        className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 h-48 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                <Filter size={20} className="text-white/60 flex-shrink-0" />
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => handleFilterChange(filter.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                            activeFilter === filter.value
                                ? 'backdrop-blur-lg bg-purple-500/80 border border-purple-400/30 text-white'
                                : 'backdrop-blur-lg bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Tickets */}
            {tickets && tickets.length > 0 ? (
                <div className="space-y-4">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full backdrop-blur-lg bg-white/10 flex items-center justify-center">
                        <svg
                            className="w-16 h-16 text-white/40"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Tickets Found</h3>
                    <p className="text-white/70 mb-6">
                        {activeFilter === 'all'
                            ? "You haven't booked any tickets yet."
                            : `No ${activeFilter} tickets found.`}
                    </p>
                    <Button onClick={() => window.location.href = '/events'}>
                        Browse Events
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TicketList;
