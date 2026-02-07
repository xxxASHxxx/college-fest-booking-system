import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, TrendingUp, ArrowRight, Sparkles, Music, Laptop, Trophy, Palette } from 'lucide-react';
import eventService from '../services/eventService';
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

            if (featuredRes.success) {
                setFeaturedEvents(featuredRes.data.content || featuredRes.data);
            }

            if (upcomingRes.success) {
                setUpcomingEvents(upcomingRes.data.content || upcomingRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
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
            <section className="relative section-padding overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-secondary-dark to-bg-dark opacity-50" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NGgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEY0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8 animate-fadeIn">
                        {/* Title */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-accent/10 border border-teal-accent/30 text-teal-accent text-sm font-medium mb-6">
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
                            <div className="flex gap-3 p-2 bg-bg-card rounded-2xl border border-border shadow-xl">
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
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${category.gradient} bg-opacity-10 border border-white/10 text-white font-medium hover:scale-105 hover:shadow-glow transition-all duration-200`}
                                >
                                    {category.icon}
                                    <span>{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
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
                    <section className="section-padding bg-gradient-to-br from-primary-dark to-secondary-dark relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC41Ij48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0aDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] " />
                        </div>

                        <div className="container relative z-10">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                <div className="space-y-2">
                                    <p className="text-4xl md:text-5xl font-extrabold text-warm-highlight">500+</p>
                                    <p className="text-text-secondary">Events Hosted</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-4xl md:text-5xl font-extrabold text-warm-highlight">10K+</p>
                                    <p className="text-text-secondary">Tickets Sold</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-4xl md:text-5xl font-extrabold text-warm-highlight">5K+</p>
                                    <p className="text-text-secondary">Happy Students</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-4xl md:text-5xl font-extrabold text-warm-highlight">4.8★</p>
                                    <p className="text-text-secondary">Average Rating</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="section-padding">
                        <div className="container">
                            <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-bg-card to-bg-dark rounded-3xl border border-border p-12 shadow-glow-accent">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    Ready to Experience Something Amazing?
                                </h2>
                                <p className="text-text-secondary text-lg mb-8">
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
                    </section>
                </>
            )}
        </div>
    );
};

export default HomePage;
