import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Calendar,
    MapPin,
    Clock,
    Users,
    Tag,
    Share2,
    Heart,
    Music,
    Info,
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';
import eventService from '../../services/eventService';
import { formatDate, formatTime, formatCurrency } from '../../utils/formatters';
import { isSoldOut, getDaysUntilEvent } from '../../utils/helpers';
import Button from '../common/Button';
import Card from '../common/Card';
import Loader from '../common/Loader';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [isFavorite, setIsFavorite] = useState(false);

    const { data: event, loading, error, execute } = useApi(eventService.getEventById);

    useEffect(() => {
        execute(id);
    }, [id]);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: event.name,
                    text: `Check out ${event.name}!`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showSuccess('Link copied to clipboard!');
            }
        } catch (error) {
            showError('Failed to share event');
        }
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        showSuccess(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
    };

    const handleBookNow = () => {
        navigate(`/booking/${id}`);
    };

    if (loading) {
        return <Loader fullScreen size="lg" text="Loading event details..." />;
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Event Not Found</h2>
                    <p className="text-white/70 mb-6">
                        The event you're looking for doesn't exist or has been removed.
                    </p>
                    <Button onClick={() => navigate('/events')}>Browse Events</Button>
                </Card>
            </div>
        );
    }

    const soldOut = isSoldOut(event);
    const daysUntil = getDaysUntilEvent(event.date);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Hero Image */}
                <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
                    <img
                        src={event.image || '/images/placeholder-event.jpg'}
                        alt={event.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Floating Actions */}
                    <div className="absolute top-6 right-6 flex gap-3">
                        <button
                            onClick={handleShare}
                            className="p-3 rounded-full backdrop-blur-lg bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-all"
                        >
                            <Share2 size={20} />
                        </button>
                        <button
                            onClick={handleFavorite}
                            className={`p-3 rounded-full backdrop-blur-lg border transition-all ${
                                isFavorite
                                    ? 'bg-red-500/80 border-red-400/30 text-white'
                                    : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                            }`}
                        >
                            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                        </button>
                    </div>

                    {/* Title & Category */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full backdrop-blur-lg bg-purple-500/80 border border-purple-400/30 text-white text-sm font-medium">
                {event.category}
              </span>
                            {soldOut && (
                                <span className="px-3 py-1 rounded-full backdrop-blur-lg bg-red-500/90 border border-red-400/30 text-white text-sm font-bold">
                  SOLD OUT
                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                            {event.name}
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Event Info */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <Info size={24} className="text-purple-400" />
                                Event Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Calendar size={20} className="text-purple-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-white/60 text-sm">Date</p>
                                        <p className="text-white font-medium">{formatDate(event.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock size={20} className="text-purple-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-white/60 text-sm">Time</p>
                                        <p className="text-white font-medium">{formatTime(event.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin size={20} className="text-purple-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-white/60 text-sm">Venue</p>
                                        <p className="text-white font-medium">{event.venue}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Users size={20} className="text-purple-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-white/60 text-sm">Available Seats</p>
                                        <p className="text-white font-medium">
                                            {soldOut ? 'Sold Out' : `${event.availableSeats} seats`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Description */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
                            <div className="text-white/80 leading-relaxed space-y-4">
                                <p>{event.description || 'No description available.'}</p>

                                {event.highlights && event.highlights.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-2">Highlights</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {event.highlights.map((highlight, index) => (
                                                <li key={index}>{highlight}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Lineup/Schedule */}
                        {event.lineup && event.lineup.length > 0 && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Music size={24} className="text-purple-400" />
                                    Lineup
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {event.lineup.map((artist, index) => (
                                        <div
                                            key={index}
                                            className="backdrop-blur-lg bg-white/5 rounded-xl p-4 border border-white/10 text-center"
                                        >
                                            <p className="text-white font-medium">{artist}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Terms & Conditions */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Terms & Conditions</h2>
                            <ul className="text-white/70 text-sm space-y-2 list-disc list-inside">
                                <li>Tickets are non-refundable</li>
                                <li>Entry is subject to availability</li>
                                <li>Age restrictions may apply</li>
                                <li>Outside food and beverages are not allowed</li>
                                <li>Management reserves the right to admission</li>
                            </ul>
                        </Card>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-24">
                            <div className="space-y-6">
                                {/* Price */}
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Starting from</p>
                                    <p className="text-4xl font-bold text-white">
                                        {formatCurrency(event.price)}
                                    </p>
                                </div>

                                {/* Countdown */}
                                {!soldOut && daysUntil > 0 && (
                                    <div className="backdrop-blur-lg bg-orange-500/20 border border-orange-400/30 rounded-xl p-4">
                                        <p className="text-orange-300 text-sm font-medium text-center">
                                            {daysUntil === 0 ? 'Event is today!' : `${daysUntil} ${daysUntil === 1 ? 'day' : 'days'} to go`}
                                        </p>
                                    </div>
                                )}

                                {/* Book Button */}
                                <Button
                                    variant={soldOut ? 'outline' : 'primary'}
                                    fullWidth
                                    size="lg"
                                    onClick={handleBookNow}
                                    disabled={soldOut}
                                >
                                    {soldOut ? 'Sold Out' : 'Book Now'}
                                </Button>

                                {/* Quick Stats */}
                                <div className="pt-6 border-t border-white/10 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/60">Category</span>
                                        <span className="text-white font-medium">{event.category}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/60">Capacity</span>
                                        <span className="text-white font-medium">{event.totalSeats || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/60">Duration</span>
                                        <span className="text-white font-medium">{event.duration || '3 hours'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
