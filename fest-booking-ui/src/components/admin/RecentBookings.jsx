import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { formatDate, formatCurrency } from '../../utils/formatters';
import './RecentBookings.css';

const RecentBookings = ({ bookings }) => {
    const navigate = useNavigate();

    if (!bookings || bookings.length === 0) {
        return (
            <div className="recent-bookings-empty">
                <p>No recent bookings</p>
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
        <div className="recent-bookings">
            <div className="bookings-table">
                <table>
                    <thead>
                    <tr>
                        <th>User</th>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id}>
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
                                <span className="event-name">{booking.event.name}</span>
                            </td>
                            <td>
                                <span className="booking-date">{formatDate(booking.createdAt)}</span>
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
                                <button
                                    className="view-btn"
                                    onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentBookings;
