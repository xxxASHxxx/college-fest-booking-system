import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Tabs from '../../components/common/Tabs';
import './ManageBookingsPage.css';

const ManageBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, [currentPage, filter]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllBookings({
                page: currentPage,
                status: filter !== 'all' ? filter : undefined,
            });
            if (response.success) {
                const raw = response.data?.data || response.data;
                const list = Array.isArray(raw) ? raw : (raw?.content || []);
                setBookings(list);
                setTotalPages(raw?.totalPages || 1);
            }
        } catch (err) {
            console.error('Failed to load bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        try {
            await adminService.updateBookingStatus(bookingId, newStatus);
            fetchBookings();
        } catch (err) {
            console.error('Failed to update booking status:', err);
        }
    };

    const getStatusBadge = (status) => {
        const s = (status || '').toString().toUpperCase();
        const variants = {
            CONFIRMED: 'success',
            PENDING_PAYMENT: 'warning',
            PENDING: 'warning',
            CANCELLED: 'danger',
            EXPIRED: 'danger',
        };
        const labels = {
            CONFIRMED: 'Confirmed',
            PENDING_PAYMENT: 'Pending Payment',
            PENDING: 'Pending',
            CANCELLED: 'Cancelled',
            EXPIRED: 'Expired',
        };
        return <Badge variant={variants[s] || 'default'}>{labels[s] || status}</Badge>;
    };

    const filteredBookings = bookings.filter((booking) =>
        (booking.eventName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tabs = [
        { value: 'all', label: 'All Bookings', content: null },
        { value: 'confirmed', label: 'Confirmed', content: null },
        { value: 'pending', label: 'Pending', content: null },
        { value: 'cancelled', label: 'Cancelled', content: null },
    ];

    if (loading) {
        return (
            <div className="loading-container">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="manage-bookings-page">
            <div className="page-header">
                <h1>Manage Bookings</h1>
                <p>View and manage all event bookings</p>
            </div>

            <div className="page-controls">
                <SearchBar
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by event, user, or email..."
                />
            </div>

            <Tabs
                tabs={tabs}
                defaultTab={filter}
                onChange={setFilter}
            />

            {filteredBookings.length === 0 ? (
                <EmptyState
                    icon="📋"
                    title="No bookings found"
                    description={searchQuery ? "No bookings match your search" : "No bookings have been made yet"}
                />
            ) : (
                <>
                    <div className="bookings-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Event</th>
                                    <th>User</th>
                                    <th>Seats</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td>#{booking.bookingReference || booking.id}</td>
                                        <td>{booking.eventName || '—'}</td>
                                        <td>
                                            <div className="user-info">
                                                <div>{booking.userName || '—'}</div>
                                                <div className="user-email">{booking.userEmail || '—'}</div>
                                            </div>
                                        </td>
                                        <td>{booking.numTickets || '—'}</td>
                                        <td>₹{booking.totalAmount != null ? Number(booking.totalAmount).toLocaleString('en-IN') : '0'}</td>
                                        <td>{booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString('en-IN') : '—'}</td>
                                        <td>{getStatusBadge(booking.bookingStatus)}</td>
                                        <td>
                                            <select
                                                value={booking.bookingStatus || 'PENDING_PAYMENT'}
                                                onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                                className="status-select"
                                            >
                                                <option value="PENDING_PAYMENT">Pending</option>
                                                <option value="CONFIRMED">Confirmed</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
};

export default ManageBookingsPage;
