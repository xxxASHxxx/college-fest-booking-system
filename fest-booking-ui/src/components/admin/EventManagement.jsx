import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    Calendar,
    MapPin,
    Users,
    DollarSign,
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';
import adminService from '../../services/adminService';
import eventService from '../../services/eventService';
import { formatDate, formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Loader from '../common/Loader';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const { showSuccess, showError } = useToast();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const result = await eventService.getAllEvents();
            if (result.success) {
                setEvents(result.data.content || result.data);
            }
        } catch (error) {
            showError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const result = await adminService.deleteEvent(selectedEvent.id);
            if (result.success) {
                showSuccess('Event deleted successfully');
                fetchEvents();
                setShowDeleteModal(false);
            } else {
                showError(result.error);
            }
        } catch (error) {
            showError('Failed to delete event');
        }
    };

    const filteredEvents = events.filter((event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <Loader fullScreen size="lg" text="Loading events..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Event Management</h1>
                    <p className="text-white/70">Create, edit, and manage all events</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                    icon={<Plus size={20} />}
                >
                    Create Event
                </Button>
            </div>

            {/* Search & Filters */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, venue, or category..."
                            icon={<Search size={20} />}
                        />
                    </div>
                    <select className="px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">All Categories</option>
                        <option value="music">Music</option>
                        <option value="dance">Dance</option>
                        <option value="tech">Tech</option>
                        <option value="sports">Sports</option>
                    </select>
                    <select className="px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">All Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">Total Events</p>
                        <Calendar className="text-purple-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">{events.length}</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">Active Events</p>
                        <Calendar className="text-green-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {events.filter((e) => e.status === 'active').length}
                    </p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">Total Bookings</p>
                        <Users className="text-blue-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {events.reduce((sum, e) => sum + (e.totalBookings || 0), 0)}
                    </p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-white/70 text-sm">Revenue</p>
                        <DollarSign className="text-yellow-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">
                        {formatCurrency(events.reduce((sum, e) => sum + (e.revenue || 0), 0))}
                    </p>
                </Card>
            </div>

            {/* Events Table */}
            <Card className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Event</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Date</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Venue</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Category</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Price</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Seats</th>
                            <th className="text-left py-3 px-4 text-white/80 font-medium text-sm">Status</th>
                            <th className="text-right py-3 px-4 text-white/80 font-medium text-sm">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredEvents.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-8 text-white/60">
                                    No events found
                                </td>
                            </tr>
                        ) : (
                            filteredEvents.map((event) => (
                                <tr key={event.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={event.image || '/images/placeholder-event.jpg'}
                                                alt={event.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="text-white font-medium line-clamp-1">{event.name}</p>
                                                <p className="text-white/60 text-xs">ID: {event.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-white/80 text-sm">
                                        {formatDate(event.date)}
                                    </td>
                                    <td className="py-3 px-4 text-white/80 text-sm line-clamp-1 max-w-xs">
                                        {event.venue}
                                    </td>
                                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full backdrop-blur-lg bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-medium capitalize">
                        {event.category}
                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-white font-medium text-sm">
                                        {formatCurrency(event.price)}
                                    </td>
                                    <td className="py-3 px-4 text-white/80 text-sm">
                                        {event.availableSeats}/{event.totalSeats || 100}
                                    </td>
                                    <td className="py-3 px-4">
                      <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                              event.status === 'active'
                                  ? 'bg-green-500/20 border border-green-400/30 text-green-300'
                                  : event.status === 'completed'
                                      ? 'bg-gray-500/20 border border-gray-400/30 text-gray-300'
                                      : 'bg-orange-500/20 border border-orange-400/30 text-orange-300'
                          }`}
                      >
                        {event.status || 'Active'}
                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => window.open(`/events/${event.id}`, '_blank')}
                                                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setShowEditModal(true);
                                                }}
                                                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create/Edit Modal */}
            <CreateEditEventModal
                isOpen={showCreateModal || showEditModal}
                onClose={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setSelectedEvent(null);
                }}
                event={selectedEvent}
                onSuccess={fetchEvents}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Event"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-white/80">
                        Are you sure you want to delete <strong>{selectedEvent?.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="danger" fullWidth onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// Create/Edit Event Modal Component
const CreateEditEventModal = ({ isOpen, onClose, event, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'music',
        date: '',
        venue: '',
        price: '',
        totalSeats: '',
        image: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        if (event) {
            setFormData({
                name: event.name || '',
                description: event.description || '',
                category: event.category || 'music',
                date: event.date ? event.date.split('T')[0] : '',
                venue: event.venue || '',
                price: event.price || '',
                totalSeats: event.totalSeats || '',
                image: event.image || '',
            });
        } else {
            setFormData({
                name: '',
                description: '',
                category: 'music',
                date: '',
                venue: '',
                price: '',
                totalSeats: '',
                image: '',
            });
        }
    }, [event, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = event
                ? await adminService.updateEvent(event.id, formData)
                : await adminService.createEvent(formData);

            if (result.success) {
                showSuccess(event ? 'Event updated successfully' : 'Event created successfully');
                onSuccess();
                onClose();
            } else {
                showError(result.error);
            }
        } catch (error) {
            showError('Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={event ? 'Edit Event' : 'Create New Event'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Event Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Annual Music Festival"
                />

                <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="Event description..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="music">Music</option>
                            <option value="dance">Dance</option>
                            <option value="drama">Drama</option>
                            <option value="sports">Sports</option>
                            <option value="tech">Tech</option>
                            <option value="art">Art</option>
                        </select>
                    </div>

                    <Input
                        label="Date & Time"
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Input
                    label="Venue"
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                    placeholder="Main Auditorium, Campus"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Price (₹)"
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="500"
                    />

                    <Input
                        label="Total Seats"
                        type="number"
                        name="totalSeats"
                        value={formData.totalSeats}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="100"
                    />
                </div>

                <Input
                    label="Image URL"
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                />

                <div className="flex gap-3 pt-4">
                    <Button variant="outline" fullWidth onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        {event ? 'Update Event' : 'Create Event'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EventManagement;
