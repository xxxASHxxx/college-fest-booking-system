import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import bookingService from '../../services/bookingService';
import BookingCard from '../../components/booking/BookingCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Tabs from '../../components/common/Tabs';
import SearchBar from '../../components/common/SearchBar';
import { trackPageView } from '../../utils/analytics';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showError } = useToast();

    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        trackPageView('My Bookings');
        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings();
    }, [bookings, activeTab, searchQuery]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const result = await bookingService.getUserBookings();
            if (result.success) {
                setBookings(result.data);
            } else {
                showError('Failed to load bookings');
            }
        } catch (error) {
            showError('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const filterBookings = () => {
        let filtered = [...bookings];

        // Filter by status
        if (activeTab !== 'all') {
            filtered = filtered.filter((booking) => booking.status === activeTab);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter((booking) =>
                booking.event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredBookings(filtered);
    };

    const tabs = [
        { id: 'all', label: 'All Bookings', count: bookings.length },
        {
            id: 'confirmed',
            label: 'Confirmed',
            count: bookings.filter((b) => b.status === 'confirmed').length,
        },
        {
            id: 'pending',
            label: 'Pending',
            count: bookings.filter((b) => b.status === 'pending').length,
        },
        {
            id: 'cancelled',
            label: 'Cancelled',
            count: bookings.filter((b) => b.status === 'cancelled').length,
        },
    ];

    return (
        <div className="my-bookings-page">
            <div className="bookings-container">
                {/* Header */}
                <div className="bookings-header">
                    <div>
                        <h1 className="page-title">My Bookings</h1>
                        <p className="page-subtitle">View and manage your event bookings</p>
                    </div>
                </div>

                {/* Search */}
                <div className="bookings-search">
                    <SearchBar
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onSearch={setSearchQuery}
                    />
                </div>

                {/* Tabs */}
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                {/* Bookings List */}
                {loading ? (
                    <div className="bookings-loading">
                        <LoadingSpinner size="large" />
                    </div>
                ) : filteredBookings.length > 0 ? (
                    <div className="bookings-grid">
                        {filteredBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onView={() => navigate(`/my-bookings/${booking.id}`)}
                                onRefresh={fetchBookings}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon="🎫"
                        title="No bookings found"
                        description={
                            searchQuery
                                ? 'No bookings match your search'
                                : activeTab === 'all'
                                    ? "You haven't made any bookings yet"
                                    : `No ${activeTab} bookings`
                        }
                        action={{
                            label: 'Browse Events',
                            onClick: () => navigate('/events'),
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
