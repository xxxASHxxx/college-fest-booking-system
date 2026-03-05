import React from 'react';
import { useNavigate } from 'react-router-dom';
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
        const s = (status || '').toUpperCase();
        switch (s) {
            case 'CONFIRMED': return 'success';
            case 'PENDING': case 'PENDING_PAYMENT': return 'warning';
            case 'CANCELLED': return 'danger';
            default: return 'default';
        }
    };

    const formatAmount = (amt) => {
        if (!amt || isNaN(amt)) return '₹0';
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
    };

    const formatDate = (d) => {
        if (!d) return '—';
        try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return '—'; }
    };

    return (
        <div className="recent-bookings">
            <div className="bookings-table">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Event</th>
                            <th>Reference</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => {
                            const userName = booking.user?.name || booking.userName || 'Unknown';
                            const eventName = booking.event?.name || booking.eventName || 'Unknown';
                            const status = booking.status || booking.bookingStatus || 'CONFIRMED';
                            const bookedDate = booking.createdAt || booking.bookedAt;
                            const ref = booking.bookingReference || `#${booking.id}`;

                            return (
                                <tr key={booking.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div
                                                style={{
                                                    width: 32, height: 32, borderRadius: '50%',
                                                    background: 'rgba(255,186,8,0.18)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#FAA307', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                                                }}
                                            >
                                                {userName.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="user-name">{userName}</span>
                                        </div>
                                    </td>
                                    <td><span className="event-name">{eventName}</span></td>
                                    <td><span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{ref}</span></td>
                                    <td><span className="booking-date">{formatDate(bookedDate)}</span></td>
                                    <td><span className="booking-amount">{formatAmount(booking.totalAmount)}</span></td>
                                    <td>
                                        <span className={`status-pill status-${getStatusVariant(status)}`}>
                                            {status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentBookings;
