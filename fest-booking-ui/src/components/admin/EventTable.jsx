import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { FiEdit2, FiTrash2, FiEye, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { formatDate, formatCurrency } from '../../utils/formatters';
import './EventTable.css';

const EventTable = ({ events, onEdit, onDelete, onToggleStatus }) => {
    if (!events || events.length === 0) {
        return (
            <div className="table-empty">
                <p>No events found</p>
            </div>
        );
    }

    const getStatusVariant = (status) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'upcoming':
                return 'info';
            case 'past':
                return 'default';
            case 'cancelled':
                return 'danger';
            default:
                return 'default';
        }
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
                        <th>Price</th>
                        <th>Seats</th>
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
                                        <img
                                            src={event.image || '/images/placeholder-event.jpg'}
                                            alt={event.name}
                                        />
                                    </div>
                                    <div className="event-info">
                                        <span className="event-name">{event.name}</span>
                                        <span className="event-category">{event.category}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className="event-date">{formatDate(event.date)}</span>
                            </td>
                            <td>
                                <span className="event-venue">{event.venue}</span>
                            </td>
                            <td>
                                <span className="event-price">{formatCurrency(event.price)}</span>
                            </td>
                            <td>
                                <div className="seats-info">
                                    <span className="seats-available">{event.availableSeats}</span>
                                    <span className="seats-total">/ {event.totalSeats}</span>
                                </div>
                            </td>
                            <td>
                                <Badge variant={getStatusVariant(event.status)}>
                                    {event.status}
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
                                        onClick={() => onEdit(event.id)}
                                        title="Edit"
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        className="action-btn toggle"
                                        onClick={() => onToggleStatus(event.id, event.status)}
                                        title={event.status === 'active' ? 'Deactivate' : 'Activate'}
                                    >
                                        {event.status === 'active' ? <FiToggleRight /> : <FiToggleLeft />}
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        onClick={() => onDelete(event.id)}
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
