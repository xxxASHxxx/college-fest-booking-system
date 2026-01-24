import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import ticketService from '../../services/ticketService';
import TicketCard from '../../components/tickets/TicketCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Tabs from '../../components/common/Tabs';
import SearchBar from '../../components/common/SearchBar';
import { trackPageView } from '../../utils/analytics';
import './MyTicketsPage.css';

const MyTicketsPage = () => {
    const navigate = useNavigate();
    const { showError } = useToast();

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
        try {
            const result = await ticketService.getUserTickets();
            if (result.success) {
                setTickets(result.data);
            } else {
                showError('Failed to load tickets');
            }
        } catch (error) {
            showError('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const filterTickets = () => {
        let filtered = [...tickets];

        // Filter by status
        if (activeTab === 'upcoming') {
            filtered = filtered.filter((ticket) => new Date(ticket.event.date) > new Date());
        } else if (activeTab === 'past') {
            filtered = filtered.filter((ticket) => new Date(ticket.event.date) < new Date());
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter((ticket) =>
                ticket.event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredTickets(filtered);
    };

    const tabs = [
        { id: 'all', label: 'All Tickets', count: tickets.length },
        {
            id: 'upcoming',
            label: 'Upcoming',
            count: tickets.filter((t) => new Date(t.event.date) > new Date()).length,
        },
        {
            id: 'past',
            label: 'Past Events',
            count: tickets.filter((t) => new Date(t.event.date) < new Date()).length,
        },
    ];

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
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onSearch={setSearchQuery}
                    />
                </div>

                {/* Tabs */}
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                {/* Tickets Grid */}
                {loading ? (
                    <div className="tickets-loading">
                        <LoadingSpinner size="large" />
                    </div>
                ) : filteredTickets.length > 0 ? (
                    <div className="tickets-grid">
                        {filteredTickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                onView={() => navigate(`/my-tickets/${ticket.id}`)}
                            />
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
                                    ? "You don't have any tickets yet"
                                    : `No ${activeTab} tickets`
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

export default MyTicketsPage;
