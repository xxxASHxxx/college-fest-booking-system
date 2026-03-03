import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import bookingService from '../../services/bookingService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/common/SearchBar';
import Button from '../../components/common/Button';
import { trackPageView } from '../../utils/analytics';
import { FiCalendar, FiTag, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import './MyTicketsPage.css';

// Map a booking from the backend into display-friendly ticket shape
const toTicketShape = (booking) => ({
    id: booking.id,
    bookingReference: booking.bookingReference || '—',
    eventName: booking.eventName || 'Unknown Event',
    tierName: booking.tierName || '—',
    numTickets: booking.numTickets || 0,
    totalAmount: booking.totalAmount || 0,
    paymentMethod: booking.paymentMethod || '—',
    bookingStatus: booking.bookingStatus || 'CONFIRMED',
    bookedAt: booking.bookedAt || null,
    seatNumbers: booking.seatNumbers || [],
});

const statusConfig = {
    CONFIRMED: { label: 'Confirmed', icon: FiCheckCircle, cls: 'status-confirmed' },
    CANCELLED: { label: 'Cancelled', icon: FiXCircle, cls: 'status-cancelled' },
    PENDING_PAYMENT: { label: 'Pending', icon: FiClock, cls: 'status-pending' },
    EXPIRED: { label: 'Expired', icon: FiClock, cls: 'status-expired' },
};

const paymentMethodLabels = {
    CARD: 'Card',
    UPI: 'UPI',
    NETBANKING: 'Net Banking',
    WALLET: 'Wallet',
};

const formatPrice = (amount) => {
    if (!amount || isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(amount);
};

const MyTicketsPage = () => {
    const navigate = useNavigate();
    const { showError, showSuccess } = useToast();

    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        trackPageView('My Tickets');
        fetchTickets();
    }, []);

    useEffect(() => {
        filterTickets();
    }, [tickets, activeTab, searchQuery]);

    const fetchTickets = async () => {
        setLoading(true);

        // Load demo bookings from localStorage
        let demoBookings = [];
        try {
            demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
        } catch (_) { }

        try {
            const result = await bookingService.getMyBookings();
            if (result.success) {
                const raw = result.data?.data || result.data;
                const apiList = Array.isArray(raw) ? raw : [];
                // Merge API bookings + demo bookings
                setTickets([...apiList.map(toTicketShape), ...demoBookings.map(toTicketShape)]);
            } else {
                // API failed — still show demo bookings
                setTickets(demoBookings.map(toTicketShape));
            }
        } catch (error) {
            console.error('Failed to load tickets:', error);
            // Still show demo bookings even if API fails
            setTickets(demoBookings.map(toTicketShape));
        } finally {
            setLoading(false);
        }
    };

    const filterTickets = () => {
        let filtered = [...tickets];

        if (activeTab === 'confirmed') {
            filtered = filtered.filter((t) => t.bookingStatus === 'CONFIRMED');
        } else if (activeTab === 'cancelled') {
            filtered = filtered.filter((t) => t.bookingStatus === 'CANCELLED');
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (t) =>
                    (t.eventName || '').toLowerCase().includes(q) ||
                    (t.bookingReference || '').toLowerCase().includes(q)
            );
        }

        setFilteredTickets(filtered);
    };

    const cancelBooking = (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

        // Update in localStorage
        try {
            const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
            const updated = demoBookings.map((b) =>
                b.id === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b
            );
            localStorage.setItem('demoBookings', JSON.stringify(updated));
        } catch (_) { }

        // Update local state immediately
        setTickets((prev) =>
            prev.map((t) =>
                t.id === bookingId ? { ...t, bookingStatus: 'CANCELLED' } : t
            )
        );
        showSuccess('Booking cancelled successfully');
    };

    const confirmed = tickets.filter((t) => t.bookingStatus === 'CONFIRMED');
    const cancelled = tickets.filter((t) => t.bookingStatus === 'CANCELLED');

    return (
        <div className="my-tickets-page">
            <div className="tickets-container">
                {/* Header */}
                <div className="tickets-header">
                    <div>
                        <h1 className="page-title">My Tickets</h1>
                        <p className="page-subtitle">View and manage your event tickets</p>
                    </div>
                </div>

                {/* Search */}
                <div className="tickets-search">
                    <SearchBar
                        placeholder="Search by event name or booking reference..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                    />
                </div>

                {/* Tab Buttons (inline, not using the Tabs component since we just need filter buttons) */}
                <div className="tickets-tabs">
                    {[
                        { id: 'all', label: 'All', count: tickets.length },
                        { id: 'confirmed', label: 'Confirmed', count: confirmed.length },
                        { id: 'cancelled', label: 'Cancelled', count: cancelled.length },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            className={`tickets-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                            <span className="tickets-tab-count">{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* Tickets Grid */}
                {loading ? (
                    <div className="tickets-loading">
                        <LoadingSpinner size="large" />
                    </div>
                ) : filteredTickets.length > 0 ? (
                    <div className="tickets-grid">
                        {filteredTickets.map((ticket) => (
                            <TicketItem key={ticket.id} ticket={ticket} onCancel={cancelBooking} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon="🎫"
                        title="No tickets found"
                        description={
                            searchQuery
                                ? 'No tickets match your search'
                                : activeTab === 'all'
                                    ? "You don't have any tickets yet. Browse events to book your first ticket!"
                                    : `No ${activeTab} tickets`
                        }
                        action={
                            <Button onClick={() => navigate('/events')}>
                                Browse Events
                            </Button>
                        }
                    />
                )}
            </div>
        </div>
    );
};

// Inline ticket card matching the glassmorphism style
const TicketItem = ({ ticket, onCancel }) => {
    const status = statusConfig[ticket.bookingStatus] || statusConfig.CONFIRMED;
    const StatusIcon = status.icon;
    const isConfirmed = ticket.bookingStatus === 'CONFIRMED';

    const paymentLabel = paymentMethodLabels[ticket.paymentMethod] || ticket.paymentMethod || '—';

    const formattedDate = ticket.bookedAt
        ? new Date(ticket.bookedAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        : '—';

    return (
        <div className="ticket-item" role="article" tabIndex={0}>
            {/* Perforated edge circles */}
            <div className="ticket-edge-left" />
            <div className="ticket-edge-right" />

            <div className="ticket-body">
                {/* Header */}
                <div className="ticket-header-row">
                    <span className="ticket-event-name">{ticket.eventName}</span>
                    <span className={`ticket-status-badge ${status.cls}`}>
                        <StatusIcon size={13} />
                        {status.label}
                    </span>
                </div>

                <div className="ticket-divider" />

                {/* Details */}
                <div className="ticket-details">
                    <div className="ticket-detail">
                        <span className="ticket-detail-label">Booking Ref</span>
                        <span className="ticket-detail-value ref">{ticket.bookingReference}</span>
                    </div>
                    <div className="ticket-detail">
                        <span className="ticket-detail-label">Tier</span>
                        <span className="ticket-detail-value">{ticket.tierName}</span>
                    </div>
                    <div className="ticket-detail">
                        <span className="ticket-detail-label">Tickets</span>
                        <span className="ticket-detail-value">{ticket.numTickets}</span>
                    </div>
                    <div className="ticket-detail">
                        <span className="ticket-detail-label">
                            <FiTag size={12} /> Amount
                        </span>
                        <span className="ticket-detail-value amount">
                            {formatPrice(ticket.totalAmount)}
                        </span>
                    </div>
                    <div className="ticket-detail">
                        <span className="ticket-detail-label">
                            <FiCalendar size={12} /> Booked On
                        </span>
                        <span className="ticket-detail-value">{formattedDate}</span>
                    </div>
                    <div className="ticket-detail">
                        <span className="ticket-detail-label">Payment</span>
                        <span className="ticket-detail-value">{paymentLabel}</span>
                    </div>
                </div>

                {ticket.seatNumbers.length > 0 && (
                    <div className="ticket-seats">
                        <span className="ticket-detail-label">Seats: </span>
                        <span className="ticket-detail-value">{ticket.seatNumbers.join(', ')}</span>
                    </div>
                )}

                {/* Cancel Button */}
                {isConfirmed && (
                    <div className="ticket-actions">
                        <button
                            className="ticket-cancel-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCancel(ticket.id);
                            }}
                        >
                            <FiXCircle size={14} />
                            Cancel Booking
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTicketsPage;
