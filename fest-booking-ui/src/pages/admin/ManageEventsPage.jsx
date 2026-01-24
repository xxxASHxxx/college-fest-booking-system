import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import adminService from '../../services/adminService';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import EventTable from '../../components/admin/EventTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { trackPageView } from '../../utils/analytics';
import './ManageEventsPage.css';

const ManageEventsPage = () => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        trackPageView('Admin - Manage Events');
        fetchEvents();
    }, [currentPage, statusFilter, searchQuery]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const result = await adminService.getEvents({
                page: currentPage,
                size: 20,
                search: searchQuery,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            });

            if (result.success) {
                setEvents(result.data.content || result.data);
                setTotalPages(result.data.totalPages || 1);
            }
        } catch (error) {
            showError('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            const result = await adminService.deleteEvent(eventId);
            if (result.success) {
                showSuccess('Event deleted successfully');
                fetchEvents();
            } else {
                showError(result.error || 'Failed to delete event');
            }
        } catch (error) {
            showError('Failed to delete event');
        }
    };

    const handleToggleStatus = async (eventId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        try {
            const result = await adminService.updateEventStatus(eventId, newStatus);
            if (result.success) {
                showSuccess(`Event ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
                fetchEvents();
            } else {
                showError(result.error || 'Failed to update status');
            }
        } catch (error) {
            showError('Failed to update status');
        }
    };

    return (
        <div className="manage-events-page">
            <div className="admin-container">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Manage Events</h1>
                        <p className="page-subtitle">Create and manage all events</p>
                    </div>
                    <Button
                        icon={<FiPlus />}
                        onClick={() => navigate('/admin/events/create')}
                    >
                        Create Event
                    </Button>
                </div>

                {/* Filters */}
                <div className="filters-bar">
                    <SearchBar
                        placeholder="Search events..."
                        value={searchQuery}
                        onSearch={setSearchQuery}
                    />

                    <div className="filter-group">
                        <FiFilter />
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="loading-container">
                        <LoadingSpinner size="large" />
                    </div>
                ) : (
                    <>
                        <EventTable
                            events={events}
                            onEdit={(id) => navigate(`/admin/events/edit/${id}`)}
                            onDelete={handleDeleteEvent}
                            onToggleStatus={handleToggleStatus}
                        />

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ManageEventsPage;
