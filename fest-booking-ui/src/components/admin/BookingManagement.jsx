import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    User,
    Mail,
    Phone,
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';
import adminService from '../../services/adminService';
import { formatDate, formatCurrency, formatDateTime } from '../../utils/formatters';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Loader from '../common/Loader';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const { showSuccess, showError } = useToast();

    useEffect(() => {
        fetchBookings();
    }, [statusFilter, dateFilter]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const filters = {
                status: statusFilter,
                startDate: dateFilter,
                page: 0,
                size: 100,
            };
            const result = await adminService.getAllBookings(filters);
            if (result.success) {
                setBookings(result.data.content || result.data);
            }
        } catch (error) {
            showError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const result = await adminService.exportBookings('csv', {
                status: statusFilter,
                startDate: dateFilter,
            });
            if (result.success) {
                showSuccess('Bookings exported successfully');
            }
        } catch (error) {
            showError('Export failed');
        }
    };

    const handleUpdateStatus = async (bookingId, newStatus, notes = '') => {
        try {
            const result = await adminService.updateBookingStatus(bookingId, newStatus, notes);
            if (result.success) {
                showSuccess('Booking status updated successfully');
                fetchBookings();
                setShowStatusModal(false);
            } else {
                showError(result.error);
            }
        } catch (error) {
            showError('Failed to update status');
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.eventName?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    const bookingStats = {
        total: bookings.length,
        confirmed: bookings.filter((b) => b.status === 'confirmed').length,
        pending: bookings.filter((b) => b.status === 'pending').length,
        cancelled: bookings.filter((b) => b.status === 'cancelled').length,
        revenue: bookings
            .filter((b) => b.status === 'confirmed')
            .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    };

    const statusConfig = {
        pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-400/30' },
        confirmed: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-400/30' },
        cancelled: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-400/30' },
        completed: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-400/30' },
        refunded: { color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-400/30' },
    };

    if (loading) {
        return <Loader fullScreen size="lg" text="Loading bookings..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Booking Management</h1>
                    <p className="text-white/70">View and manage all event bookings</p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleExport}
                    icon={<Download size={20} />}
                >
                    Export Bookings
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">Total Bookings</p>
                        <Calendar className="text-purple-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">{bookingStats.total}</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">Confirmed</p>
                        <CheckCircle className="text-green-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">{bookingStats.confirmed}</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">Pending</p>
                        <Clock className="text-yellow-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">{bookingStats.pending}</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">Cancelled</p>
                        <XCircle className="text-red-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">{bookingStats.cancelled}</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">Total Revenue</p>
                        <Calendar className="text-blue-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-white">{formatCurrency(bookingStats.revenue)}</p>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by booking ID, user, or event..."
                            icon={<Search size={20} />}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                    <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="md:w-64"
                    />
                </div>
            </Card>

            {/* Bookings Table */}
            <Card className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Booking ID</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">User</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Event</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Date</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Tickets</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Amount</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Status</th>
                            <th className="text-right py-3 px-4 text-white/80 font-medium text-sm">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-8 text-white/60">
                                    No bookings found
                                </td>
                            </tr>
                        ) : (
                            filteredBookings.map((booking) => {
                                const status = statusConfig[booking.status] || statusConfig.pending;
                                return (
                                    <tr
                                        key={booking.id}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="py-3 px-4">
                                            <p className="text-white font-mono text-sm">{booking.id}</p>
                                            <p className="text-white/60 text-xs">
                                                {formatDateTime(booking.createdAt)}
                                            </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="text-white font-medium text-sm">
                                                    {booking.userName || 'N/A'}
                                                </p>
                                                <p className="text-white/60 text-xs">{booking.userEmail}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-white text-sm line-clamp-1 max-w-xs">
                                                {booking.eventName}
                                            </p>
                                        </td>
                                        <td className="py-3 px-4 text-white/80 text-sm">
                                            {formatDate(booking.eventDate)}
                                        </td>
                                        <td className="py-3 px-4 text-white/80 text-sm">
                                            {booking.quantity || 1}
                                        </td>
                                        <td className="py-3 px-4 text-white font-medium text-sm">
                                            {formatCurrency(booking.totalAmount)}
                                        </td>
                                        <td className="py-3 px-4">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${status.bg} ${status.border} ${status.color}`}
                        >
                          {booking.status}
                        </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setShowDetailsModal(true);
                                                    }}
                                                    className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setShowStatusModal(true);
                                                        }}
                                                        className="p-2 rounded-lg text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all"
                                                        title="Update Status"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <Modal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    title="Booking Details"
                    size="lg"
                >
                    <div className="space-y-6">
                        {/* Booking Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-white/60 text-sm mb-1">Booking ID</p>
                                <p className="text-white font-mono">{selectedBooking.id}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm mb-1">Status</p>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                                        statusConfig[selectedBooking.status]?.bg
                                    } ${statusConfig[selectedBooking.status]?.border} ${
                                        statusConfig[selectedBooking.status]?.color
                                    }`}
                                >
                  {selectedBooking.status}
                </span>
                            </div>
                        </div>

                        {/* User Info */}
                        <div>
                            <h3 className="text-white font-bold mb-3">User Information</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-white/80">
                                    <User size={16} className="text-purple-400" />
                                    <span>{selectedBooking.userName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/80">
                                    <Mail size={16} className="text-purple-400" />
                                    <span>{selectedBooking.userEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/80">
                                    <Phone size={16} className="text-purple-400" />
                                    <span>{selectedBooking.userPhone || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Event Info */}
                        <div>
                            <h3 className="text-white font-bold mb-3">Event Information</h3>
                            <div className="space-y-2 text-white/80">
                                <p>
                                    <span className="text-white/60">Event: </span>
                                    {selectedBooking.eventName}
                                </p>
                                <p>
                                    <span className="text-white/60">Date: </span>
                                    {formatDate(selectedBooking.eventDate)}
                                </p>
                                <p>
                                    <span className="text-white/60">Venue: </span>
                                    {selectedBooking.eventVenue || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div>
                            <h3 className="text-white font-bold mb-3">Booking Details</h3>
                            <div className="space-y-2 text-white/80">
                                <div className="flex justify-between">
                                    <span className="text-white/60">Tickets:</span>
                                    <span>{selectedBooking.quantity || 1}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Seat Type:</span>
                                    <span className="capitalize">{selectedBooking.seatType || 'General'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Payment Method:</span>
                                    <span className="capitalize">{selectedBooking.paymentMethod || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                                    <span className="text-white">Total Amount:</span>
                                    <span className="text-white">{formatCurrency(selectedBooking.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Status Update Modal */}
            <StatusUpdateModal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                booking={selectedBooking}
                onUpdate={handleUpdateStatus}
            />
        </div>
    );
};

// Status Update Modal Component
const StatusUpdateModal = ({ isOpen, onClose, booking, onUpdate }) => {
    const [newStatus, setNewStatus] = useState('confirmed');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await onUpdate(booking?.id, newStatus, notes);
        setIsSubmitting(false);
        setNotes('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Update Booking Status" size="md">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">New Status</label>
                    <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">Notes (Optional)</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        placeholder="Add any notes about this status change..."
                        className="w-full px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button variant="outline" fullWidth onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleSubmit}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        Update Status
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default BookingManagement;
