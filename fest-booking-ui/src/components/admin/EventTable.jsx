import React from 'react';
import Badge from '../common/Badge';
import { FiEdit2, FiTrash2, FiEye, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';
import './EventTable.css';

const EventTable = ({ events, onEdit, onDelete, onToggleStatus }) => {
    if (!events || events.length === 0) {
        return (
            <div className="table-empty">
                <p>No events found. Backend may be offline — events will appear when connected.</p>
            </div>
        );
    }

    // Map backend EventStatus enum values to badge variants
    const getStatusVariant = (status) => {
        if (!status) return 'default';
        const s = status.toString().toUpperCase();
        switch (s) {
            case 'ACTIVE':
            case 'PUBLISHED':
            case 'BOOKING_OPEN':
                return 'success';
            case 'DRAFT':
                return 'info';
            case 'INACTIVE':
            case 'BOOKING_CLOSED':
                return 'warning';
            case 'SOLD_OUT':
                return 'warning';
            case 'CANCELLED':
                return 'danger';
            case 'COMPLETED':
                return 'default';
            default:
                return 'default';
        }
    };

    // Get a human-readable status label
    const getStatusLabel = (status) => {
        if (!status) return '—';
        return status.toString().replace(/_/g, ' ');
    };

    // Safely get venue name: venue may be an object { venueName } or a string
    const getVenueName = (venue) => {
        if (!venue) return '—';
        if (typeof venue === 'string') return venue;
        return venue.venueName || venue.name || '—';
    };

    const isActive = (status) => {
        const s = (status || '').toString().toUpperCase();
        return s === 'ACTIVE' || s === 'BOOKING_OPEN' || s === 'PUBLISHED';
    };

    return (
        <div className="event-table-wrapper">
            <div className="event-table">
                <table>
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Date</th>
                            <th>Venue</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id}>
                                <td>
                                    <div className="event-cell">
                                        <div className="event-image">
                                            {event.bannerImageUrl ? (
                                                <img
                                                    src={event.bannerImageUrl}
                                                    alt={event.eventName || 'Event'}
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <div
                                                    className="event-image-placeholder"
                                                    style={{ background: `hsl(${((event.id || 1) * 47) % 360}, 55%, 35%)` }}
                                                >
                                                    {(event.eventName || event.name || 'E').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="event-info">
                                            <span className="event-name">{event.eventName || event.name || '—'}</span>
                                            <span className="event-category">{event.eventType || event.category || '—'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="event-date">
                                        {formatDate(event.eventDate || event.date)}
                                    </span>
                                </td>
                                <td>
                                    <span className="event-venue">{getVenueName(event.venue)}</span>
                                </td>
                                <td>
                                    <div className="seats-info">
                                        <span className="seats-total">{event.maxCapacity || event.totalSeats || '—'}</span>
                                    </div>
                                </td>
                                <td>
                                    <Badge variant={getStatusVariant(event.status)}>
                                        {getStatusLabel(event.status)}
                                    </Badge>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn view"
                                            onClick={() => window.open(`/events/${event.id}`, '_blank')}
                                            title="View"
                                        >
                                            <FiEye />
                                        </button>
                                        <button
                                            className="action-btn edit"
                                            onClick={() => onEdit && onEdit(event.id)}
                                            title="Edit"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            className="action-btn toggle"
                                            onClick={() => onToggleStatus && onToggleStatus(event.id, event.status)}
                                            title={isActive(event.status) ? 'Deactivate' : 'Activate'}
                                        >
                                            {isActive(event.status) ? <FiToggleRight /> : <FiToggleLeft />}
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => onDelete && onDelete(event.id)}
                                            title="Delete"
                                        >
                                            <FiTrash2 />
                                        </button>
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

export default EventTable;
