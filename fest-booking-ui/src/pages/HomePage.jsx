import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, TrendingUp, ArrowRight, Sparkles, Music, Laptop, Trophy, Palette } from 'lucide-react';
import eventService from '../services/eventService';
import seedEvents from '../data/seedEvents';
import Button from '../components/common/Button';
import EventCard from '../components/events/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Chip from '../components/common/Chip';
import { trackPageView } from '../utils/analytics';

const HomePage = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        trackPageView('Home');
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const [featuredRes, upcomingRes] = await Promise.all([
                eventService.getEvents({ featured: true, size: 6 }),
                eventService.getEvents({ status: 'upcoming', size: 8 }),
            ]);

            // Use API data if available, otherwise fallback to seed data
            const featuredData = (featuredRes.success && (featuredRes.data.content || featuredRes.data)) || [];
            const upcomingData = (upcomingRes.success && (upcomingRes.data.content || upcomingRes.data)) || [];

            // If API returns empty data, use seed events as fallback
            setFeaturedEvents(featuredData.length > 0 ? featuredData : seedEvents.slice(0, 6));
            setUpcomingEvents(upcomingData.length > 0 ? upcomingData : seedEvents);

        } catch (error) {
            console.error('Failed to fetch events:', error);
            // On error, use seed events as fallback
            setFeaturedEvents(seedEvents.slice(0, 6));
            setUpcomingEvents(seedEvents);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const categories = [
        { name: 'Music', icon: <Music size={20} />, value: 'music', gradient: 'from-purple-500 to-pink-500' },
        { name: 'Tech', icon: <Laptop size={20} />, value: 'tech', gradient: 'from-blue-500 to-cyan-500' },
        { name: 'Sports', icon: <Trophy size={20} />, value: 'sports', gradient: 'from-orange-500 to-red-500' },
        { name: 'Cultural', icon: <Palette size={20} />, value: 'cultural', gradient: 'from-green-500 to-emerald-500' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative section-padding overflow-hidden min-h-[600px] md:min-h-[700px]">
                {/* Hero Background Video */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ zIndex: 0 }}
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                >
                    <source src="/festmainvideo.mp4" type="video/mp4" />
                </video>

                {/* Video Overlay - Multi-layer gradient for text readability */}
                <div
                    className="absolute inset-0"
                    style={{
                        zIndex: 1,
                        background: `
                            linear-gradient(
                                to bottom,
                                rgba(3, 7, 30, 0.75) 0%,
                                rgba(55, 6, 23, 0.55) 50%,
                                rgba(3, 7, 30, 0.95) 100%
                            )
                        `
                    }}
                />

                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NGgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEG0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" style={{ zIndex: 2 }} />

                <div className="container relative z-10" style={{ zIndex: 10 }}>
                    <div className="max-w-4xl mx-auto text-center space-y-8 animate-fadeIn">
                        {/* Title */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-accent/10 border border-teal-accent/30 text-teal-accent text-sm font-medium mb-6" style={{ backdropFilter: 'blur(8px)' }}>
                                <Sparkles size={16} />
                                <span>Your Campus Event Hub</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                                Discover Amazing
                                <span className="block mt-2 text-gradient">
                                    College Events
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
                                Book tickets for the hottest events on campus. From cultural fests to tech symposiums, find and book your favorite events in just a few clicks.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                            <div className="flex gap-3 p-2 rounded-2xl border border-border shadow-xl" style={{ background: 'rgba(55, 6, 23, 0.45)', backdropFilter: 'blur(16px)' }}>
                                <div className="flex-1 flex items-center gap-3 px-4">
                                    <Search className="text-text-muted" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search events, artists, venues..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder-text-muted"
                                    />
                                </div>
                                <Button type="submit" size="lg">
                                    Search
                                </Button>
                            </div>
                        </form>

                        {/* Category Quick Filters */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category.value}
                                    onClick={() => navigate(`/events?category=${category.value}`)}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl border text-white font-medium hover:scale-105 transition-all duration-200"
                                    style={{
                                        background: 'rgba(55, 6, 23, 0.35)',
                                        borderColor: 'rgba(255, 186, 8, 0.25)',
                                        backdropFilter: 'blur(8px)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(55, 6, 23, 0.55)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 186, 8, 0.45)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 186, 8, 0.12)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(55, 6, 23, 0.35)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 186, 8, 0.25)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {category.icon}
                                    <span>{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reduced motion support */}
                <style jsx>{`
                    @media (prefers-reduced-motion: reduce) {
                        video {
                            animation-play-state: paused !important;
                        }
                    }
                `}</style>
            </section>

            {/* Featured Events Section */}
            {loading ? (
                <div className="section-padding flex justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <>
                    {featuredEvents.length > 0 && (
                        <section className="section-padding bg-bg-darker">
                            <div className="container">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Events</h2>
                                        <p className="text-text-secondary">Don't miss these handpicked experiences</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate('/events')}
                                        icon={<ArrowRight size={18} />}
                                        iconPosition="right"
                                    >
                                        View All
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {featuredEvents.map((event) => (
                                        <div key={event.id} className="animate-slideUp">
                                            <EventCard event={event} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Upcoming Events Section */}
                    {upcomingEvents.length > 0 && (
                        <section className="section-padding">
                            <div className="container">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-bold mb-2">Upcoming Events</h2>
                                        <p className="text-text-secondary">What's happening next on campus</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate('/events')}
                                        icon={<ArrowRight size={18} />}
                                        iconPosition="right"
                                    >
                                        See More
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {upcomingEvents.slice(0, 4).map((event, index) => (
                                        <div key={event.id} className="animate-slideUp" style={{ animationDelay: `${index * 100}ms` }}>
                                            <EventCard event={event} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Stats Section */}
                    <section className="section-padding relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #370617 0%, #6A040F 50%, #370617 100%)' }}>
                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC41Ij48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0aDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] " />
                        </div>

                        {/* Bottom fade to blend into page */}
                        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to bottom, transparent, #03071E)' }} />

                        <div className="container relative z-10">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                                {/* Stat Card 1 */}
                                <div
                                    className="rounded-2xl p-6 md:p-8 text-center transform hover:scale-105 transition-all duration-300"
                                    style={{
                                        background: 'rgba(55, 6, 23, 0.55)',
                                        border: '1px solid rgba(255, 186, 8, 0.25)',
                                        backdropFilter: 'blur(12px)',
                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    <p className="text-4xl md:text-5xl font-extrabold text-warm-highlight mb-2">500+</p>
                                    <p className="text-text-secondary text-sm md:text-base">Events Hosted</p>
                                </div>

                                {/* Stat Card 2 */}
                                <div
                                    className="rounded-2xl p-6 md:p-8 text-center transform hover:scale-105 transition-all duration-300"
                                    style={{
                                        background: 'rgba(55, 6, 23, 0.55)',
                                        border: '1px solid rgba(255, 186, 8, 0.25)',
                                        backdropFilter: 'blur(12px)',
                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    <p className="text-4xl md:text-5xl font-extrabold text-warm-highlight mb-2">10K+</p>
                                    <p className="text-text-secondary text-sm md:text-base">Tickets Sold</p>
                                </div>

                                {/* Stat Card 3 */}
                                <div
                                    className="rounded-2xl p-6 md:p-8 text-center transform hover:scale-105 transition-all duration-300"
                                    style={{
                                        background: 'rgba(55, 6, 23, 0.55)',
                                        border: '1px solid rgba(255, 186, 8, 0.25)',
                                        backdropFilter: 'blur(12px)',
                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    <p className="text-4xl md:text-5xl font-extrabold text-warm-highlight mb-2">5K+</p>
                                    <p className="text-text-secondary text-sm md:text-base">Happy Students</p>
                                </div>

                                {/* Stat Card 4 */}
                                <div
                                    className="rounded-2xl p-6 md:p-8 text-center transform hover:scale-105 transition-all duration-300"
                                    style={{
                                        background: 'rgba(55, 6, 23, 0.55)',
                                        border: '1px solid rgba(255, 186, 8, 0.25)',
                                        backdropFilter: 'blur(12px)',
                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    <p className="text-4xl md:text-5xl font-extrabold text-warm-highlight mb-2">4.8★</p>
                                    <p className="text-text-secondary text-sm md:text-base">Average Rating</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="section-padding relative overflow-hidden min-h-[500px] flex items-center">
                        {/* Background Video */}
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            style={{ zIndex: 0 }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        >
                            <source src="/festenjoy.mp4" type="video/mp4" />
                        </video>

                        {/* Video Overlay - Gradient for readability */}
                        <div
                            className="absolute inset-0"
                            style={{
                                zIndex: 1,
                                background: `
                                    linear-gradient(
                                        to bottom,
                                        rgba(3, 7, 30, 0.72) 0%,
                                        rgba(55, 6, 23, 0.55) 50%,
                                        rgba(3, 7, 30, 0.86) 100%
                                    )
                                `
                            }}
                        />

                        <div className="container relative z-10" style={{ zIndex: 10 }}>
                            <div
                                className="max-w-4xl mx-auto text-center rounded-3xl p-12 md:p-16"
                                style={{
                                    background: 'rgba(55, 6, 23, 0.35)',
                                    border: '1px solid rgba(255, 186, 8, 0.22)',
                                    backdropFilter: 'blur(16px)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 186, 8, 0.12)'
                                }}
                            >
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-white">
                                    Ready to Experience Something Amazing?
                                </h2>
                                <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                                    Browse all events and find your next adventure
                                </p>
                                <Button
                                    size="xl"
                                    onClick={() => navigate('/events')}
                                    icon={<ArrowRight size={24} />}
                                    iconPosition="right"
                                >
                                    Explore All Events
                                </Button>
                            </div>
                        </div>

                        {/* Reduced motion support */}
                        <style jsx>{`
                            @media (prefers-reduced-motion: reduce) {
                                video {
                                    animation-play-state: paused !important;
                                    opacity: 0;
                                }
                            }
                        `}</style>
                    </section>
                </>
            )}
        </div>
    );
};

export default HomePage;
