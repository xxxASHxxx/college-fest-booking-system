import React from 'react';
import { Calendar, MapPin, Users, Tag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { isSoldOut, getDaysUntilEvent } from '../../utils/helpers';
import Card from '../common/Card';
import Button from '../common/Button';

const EventCard = ({ event, onBookNow }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/events/${event.id}`);
    };

    const handleBookNow = (e) => {
        e.stopPropagation();
        if (onBookNow) {
            onBookNow(event);
        } else {
            navigate(`/booking/${event.id}`);
        }
    };

    const daysUntil = getDaysUntilEvent(event.date);
    const soldOut = isSoldOut(event);

    return (
        <Card
            variant="default"
            hoverable
            onClick={handleViewDetails}
            className="group overflow-hidden"
        >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
                <img
                    src={event.image || '/images/placeholder-event.jpg'}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full backdrop-blur-lg bg-white/20 border border-white/30 text-white text-xs font-medium">
            {event.category}
          </span>
                </div>

                {/* Sold Out Badge */}
                {soldOut && (
                    <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full backdrop-blur-lg bg-red-500/90 border border-red-400/30 text-white text-xs font-bold">
              SOLD OUT
            </span>
                    </div>
                )}

                {/* Days Until Event */}
                {!soldOut && daysUntil > 0 && daysUntil <= 7 && (
                    <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1 rounded-full backdrop-blur-lg bg-orange-500/90 border border-orange-400/30 text-white text-xs font-medium">
              {daysUntil} {daysUntil === 1 ? 'day' : 'days'} left
            </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                {/* Title */}
                <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {event.name}
                </h3>

                {/* Date & Location */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Calendar size={16} className="flex-shrink-0" />
                        <span>{formatDate(event.date)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-white/70 text-sm">
                        <MapPin size={16} className="flex-shrink-0" />
                        <span className="line-clamp-1">{event.venue}</span>
                    </div>
                </div>

                {/* Seats Available */}
                {!soldOut && (
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Users size={16} className="flex-shrink-0" />
                        <span>
              {event.availableSeats} {event.availableSeats === 1 ? 'seat' : 'seats'} available
            </span>
                    </div>
                )}

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div>
                        <p className="text-white/60 text-xs">Starting from</p>
                        <p className="text-2xl font-bold text-white">
                            {formatCurrency(event.price)}
                        </p>
                    </div>

                    <Button
                        variant={soldOut ? 'outline' : 'primary'}
                        size="sm"
                        onClick={handleBookNow}
                        disabled={soldOut}
                        icon={!soldOut && <ArrowRight size={18} />}
                        iconPosition="right"
                    >
                        {soldOut ? 'Sold Out' : 'Book Now'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default EventCard;
