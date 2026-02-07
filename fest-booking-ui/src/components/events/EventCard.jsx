import React from 'react';
import { Calendar, MapPin, Users, Clock, ArrowRight, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { isSoldOut, getDaysUntilEvent } from '../../utils/helpers';
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

    // Parse dates if in DD-MM-YY format
    const formatEventDate = () => {
        if (event.dateStart && event.dateEnd) {
            // If same day
            if (event.dateStart === event.dateEnd) {
                const [day, month, year] = event.dateStart.split('-');
                return `${day} ${getMonthName(month)} '${year}`;
            }
            // Different days
            const [day1, month1, year1] = event.dateStart.split('-');
            const [day2, month2, year2] = event.dateEnd.split('-');
            if (month1 === month2 && year1 === year2) {
                return `${day1}-${day2} ${getMonthName(month1)} '${year1}`;
            }
            return `${day1} ${getMonthName(month1)} - ${day2} ${getMonthName(month2)} '${year1}`;
        }
        return formatDate(event.date);
    };

    const getMonthName = (month) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[parseInt(month) - 1] || '';
    };

    return (
        <div
            className="group rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02] hover:-translate-y-1 cursor-pointer"
            onClick={handleViewDetails}
            style={{
                background: 'rgba(55, 6, 23, 0.35)',
                border: '1px solid rgba(255, 186, 8, 0.18)',
                backdropFilter: 'blur(14px)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 186, 8, 0.32)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 186, 8, 0.12)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 186, 8, 0.18)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
            }}
            tabIndex={0}
            role="article"
            aria-label={`Event: ${event.name || event.title}`}
        >
            {/* Cover Image */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={event.coverImage || event.image || '/images/placeholder-event.jpg'}
                    alt={event.name || event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = '/images/placeholder-event.jpg';
                    }}
                />

                {/* Gradient Overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(3, 7, 30, 0.1) 0%, rgba(3, 7, 30, 0.7) 100%)'
                    }}
                />

                {/* Highlights Badges */}
                {event.highlights && event.highlights.length > 0 && (
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {event.highlights.map((highlight, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                                style={{
                                    background: 'rgba(255, 186, 8, 0.9)',
                                    color: '#03071E',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                <Award size={12} />
                                {highlight}
                            </span>
                        ))}
                    </div>
                )}

                {/* Days Until Event */}
                {!soldOut && daysUntil > 0 && daysUntil <= 7 && (
                    <div className="absolute top-3 left-3">
                        <span
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{
                                background: 'rgba(244, 140, 6, 0.95)',
                                color: '#FFFFFF',
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            {daysUntil} {daysUntil === 1 ? 'day' : 'days'} left
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Organizer Row */}
                <div className="flex items-center gap-3">
                    <img
                        src={event.organizerLogo || '/images/placeholder-org.png'}
                        alt={event.organizerName || 'Organizer'}
                        className="w-10 h-10 rounded-full object-cover border-2"
                        style={{ borderColor: 'rgba(255, 186, 8, 0.3)' }}
                        onError={(e) => {
                            e.target.src = '/images/placeholder-org.png';
                        }}
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-text-secondary truncate">
                            {event.organizerName || 'Organizer'}
                        </p>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight">
                    {event.name || event.title}
                </h3>

                {/* Tags/Categories */}
                {(event.tags || event.categories) && (
                    <div className="flex flex-wrap gap-2">
                        {(event.tags || event.categories).slice(0, 3).map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{
                                    background: 'rgba(55, 6, 23, 0.6)',
                                    border: '1px solid rgba(255, 186, 8, 0.25)',
                                    color: '#FAA307',
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                        {(event.tags || event.categories).length > 3 && (
                            <span
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{
                                    background: 'rgba(55, 6, 23, 0.6)',
                                    border: '1px solid rgba(255, 186, 8, 0.25)',
                                    color: '#FAA307',
                                }}
                            >
                                +{(event.tags || event.categories).length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Date & Time */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <Calendar size={16} className="flex-shrink-0" style={{ color: '#FAA307' }} />
                        <span>{formatEventDate()}</span>
                    </div>

                    {(event.timeStart || event.timeEnd) && (
                        <div className="flex items-center gap-2 text-text-secondary text-sm">
                            <Clock size={16} className="flex-shrink-0" style={{ color: '#FAA307' }} />
                            <span>{event.timeStart}{event.timeEnd && event.timeEnd !== event.timeStart ? ` - ${event.timeEnd}` : ''}</span>
                        </div>
                    )}

                    {event.venue && (
                        <div className="flex items-center gap-2 text-text-secondary text-sm">
                            <MapPin size={16} className="flex-shrink-0" style={{ color: '#FAA307' }} />
                            <span className="line-clamp-1">{event.venue}</span>
                        </div>
                    )}
                </div>

                {/* Seats Available */}
                {!soldOut && event.availableSeats && (
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <Users size={16} className="flex-shrink-0" style={{ color: '#FAA307' }} />
                        <span>
                            {event.availableSeats} {event.availableSeats === 1 ? 'seat' : 'seats'} available
                        </span>
                    </div>
                )}

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255, 186, 8, 0.1)' }}>
                    <div>
                        {event.price !== undefined && (
                            <>
                                <p className="text-text-secondary text-xs mb-1">
                                    {event.price === 0 ? 'Free Event' : 'Starting from'}
                                </p>
                                <p className="text-2xl font-bold text-white">
                                    {event.price === 0 ? 'FREE' : formatCurrency(event.price)}
                                </p>
                            </>
                        )}
                    </div>

                    <Button
                        variant={soldOut ? 'outline' : 'primary'}
                        size="sm"
                        onClick={handleBookNow}
                        disabled={soldOut}
                        icon={!soldOut && <ArrowRight size={18} />}
                        iconPosition="right"
                        className="focus:ring-2 focus:ring-warm-highlight focus:ring-offset-2 focus:ring-offset-bg-dark"
                    >
                        {soldOut ? 'Sold Out' : 'View Details'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
