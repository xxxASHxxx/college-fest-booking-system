import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

const FeaturedEvents = ({ events }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!events || events.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [events]);

    if (!events || events.length === 0) {
        return null;
    }

    const currentEvent = events[currentIndex];

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % events.length);
    };

    return (
        <div className="relative h-[600px] rounded-3xl overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={currentEvent.image || '/images/placeholder-event.jpg'}
                    alt={currentEvent.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center px-8 md:px-16">
                <div className="max-w-2xl space-y-6 animate-slideUp">
                    {/* Featured Badge */}
                    <div className="flex items-center gap-2 text-yellow-400">
                        <Star size={24} fill="currentColor" />
                        <span className="text-lg font-semibold">Featured Event</span>
                    </div>

                    {/* Category */}
                    <span className="inline-block px-4 py-2 rounded-full backdrop-blur-lg bg-purple-500/80 border border-purple-400/30 text-white text-sm font-medium">
            {currentEvent.category}
          </span>

                    {/* Title */}
                    <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                        {currentEvent.name}
                    </h2>

                    {/* Description */}
                    <p className="text-xl text-white/90 leading-relaxed line-clamp-3">
                        {currentEvent.description || 'Experience an unforgettable event!'}
                    </p>

                    {/* Info */}
                    <div className="flex flex-wrap items-center gap-6 text-white/90">
                        <div>
                            <p className="text-sm text-white/60">Date</p>
                            <p className="font-semibold">{formatDate(currentEvent.date)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-white/60">Venue</p>
                            <p className="font-semibold">{currentEvent.venue}</p>
                        </div>
                        <div>
                            <p className="text-sm text-white/60">Price</p>
                            <p className="text-2xl font-bold">{formatCurrency(currentEvent.price)}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate(`/booking/${currentEvent.id}`)}
                        >
                            Book Now
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => navigate(`/events/${currentEvent.id}`)}
                        >
                            View Details
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-all"
                aria-label="Previous event"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-all"
                aria-label="Next event"
            >
                <ChevronRight size={24} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {events.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            index === currentIndex
                                ? 'w-8 bg-white'
                                : 'bg-white/50 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturedEvents;
