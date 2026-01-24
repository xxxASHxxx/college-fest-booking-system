import React from 'react';
import EventCard from './EventCard';
import Loader from '../common/Loader';

const EventGrid = ({ events, loading, onBookNow }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <div
                        key={index}
                        className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 h-96 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
                <p className="text-white/70">
                    Try adjusting your filters or check back later for new events.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <EventCard key={event.id} event={event} onBookNow={onBookNow} />
            ))}
        </div>
    );
};

export default EventGrid;
