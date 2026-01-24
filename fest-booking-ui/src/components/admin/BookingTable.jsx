import React from 'react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { FiEye, FiCheck, FiX } from 'react-icons/fi';
import { formatDate, formatCurrency } from '../../utils/formatters';
import './BookingTable.css';

const BookingTable = ({ bookings, onUpdateStatus }) => {
    if (!bookings || bookings.length === 0) {
        return (
            <div className="table-empty">
                <p>No bookings found</p>
            </div>
        );
    }

    const getStatusVariant = (status) => {
        switch (status) {
            case 'confirmed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'danger';
            default:
                return 'default';
        }
    };

    return (
        <div className="booking-table-wrapper">
            <div className="booking-table">
                <table>
                    <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>User</th>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td>
                                <span className="booking-id">#{booking.id.slice(0, 8)}</span>
                            </td>
                            <td>
                                <div className="user-cell">
                                    <Avatar
                                        src={booking.user.avatar}
                                        alt={booking.user.name}
                                        size="sm"
                                        name={booking.user.name}
                                    />
                                    <div className="user-info">
                                        <span className="user-name">{booking.user.name}</span>
                                        <span className="user-email">{booking.user.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="event-cell">
                                    <span className="event-name">{booking.event.name}</span>
                                    <span className="event-date">{formatDate(booking.event.date)}</span>
                                </div>
                            </td>
                            <td>
                                <span className="booking-date">{formatDate(booking.createdAt)}</span>
                            </td>
                            <td>
                                <span className="booking-quantity">{booking.quantity}</span>
                            </td>
                            <td>
                                <span className="booking-amount">{formatCurrency(booking.totalAmount)}</span>
                            </td>
                            <td>
                                <Badge variant={getStatusVariant(booking.status)}>
                                    {booking.status}
                                </Badge>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button
                                        className="action-btn view"
                                        onClick={() => window.open(`/my-bookings/${booking.id}`, '_blank')}
                                        title="View Details"
                                    >
                                        <FiEye />
                                    </button>
                                    {booking.status === 'pending' && (
                                        <>
                                            <button
                                                className="action-btn confirm"
                                                onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                                                title="Confirm"
                                            >
                                                <FiCheck />
                                            </button>
                                            <button
                                                className="action-btn cancel"
                                                onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                                                title="Cancel"
                                            >
                                                <FiX />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingTable;
