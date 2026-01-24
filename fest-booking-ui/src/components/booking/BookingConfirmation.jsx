import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Mail, Calendar, Ticket as TicketIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../hooks/useToast';
import ticketService from '../../services/ticketService';
import { formatDate, formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';
import Card from '../common/Card';

const BookingConfirmation = ({ bookingId, event, bookingData }) => {
    const [tickets, setTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        // Trigger confetti animation
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        // Fetch tickets
        fetchTickets();

        return () => clearInterval(interval);
    }, []);

    const fetchTickets = async () => {
        try {
            const result = await ticketService.getTicketsByBookingId(bookingId);
            if (result.success) {
                setTickets(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        } finally {
            setLoadingTickets(false);
        }
    };

    const handleDownloadTicket = async (ticketId) => {
        const result = await ticketService.downloadTicket(ticketId);
        if (result.success) {
            showSuccess('Ticket downloaded successfully!');
        } else {
            showError('Failed to download ticket');
        }
    };

    const handleViewTickets = () => {
        navigate('/my-tickets');
    };

    const seatTypes = {
        general: { label: 'General', price: event.price },
        vip: { label: 'VIP', price: event.price * 1.5 },
        premium: { label: 'Premium', price: event.price * 2 },
    };

    const selectedSeatType = seatTypes[bookingData.seatType];

    return (
        <div className="space-y-6 animate-slideUp">
            {/* Success Message */}
            <Card className="p-8 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="text-green-400" size={64} />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Booking Confirmed! 🎉
                </h1>

                <p className="text-xl text-white/80 mb-6">
                    Your tickets have been successfully booked
                </p>

                {/* Booking ID */}
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl backdrop-blur-lg bg-purple-500/20 border border-purple-400/30">
                    <span className="text-white/70">Booking ID:</span>
                    <span className="text-white font-mono font-bold text-lg">{bookingId}</span>
                </div>

                <p className="text-sm text-white/60 mt-4">
                    A confirmation email has been sent to {bookingData.contactInfo.email}
                </p>
            </Card>

            {/* Event Details */}
            <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Event Image */}
                    <div className="md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                            src={event.image || '/images/placeholder-event.jpg'}
                            alt={event.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 space-y-4">
                        <h2 className="text-2xl font-bold text-white">{event.name}</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-3">
                                <Calendar size={20} className="text-purple-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-white/60">Event Date</p>
                                    <p className="text-white font-medium">{formatDate(event.date)}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <TicketIcon size={20} className="text-purple-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-white/60">Tickets</p>
                                    <p className="text-white font-medium">
                                        {bookingData.quantity} × {selectedSeatType.label}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail size={20} className="text-purple-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-white/60">Email</p>
                                    <p className="text-white font-medium">{bookingData.contactInfo.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Download size={20} className="text-purple-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-white/60">Amount Paid</p>
                                    <p className="text-white font-bold text-lg">
                                        {formatCurrency(event.price * bookingData.quantity * 1.23)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tickets List */}
            {!loadingTickets && tickets.length > 0 && (
                <Card className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Your Tickets</h3>
                    <div className="space-y-3">
                        {tickets.map((ticket, index) => (
                            <div
                                key={ticket.id}
                                className="flex items-center justify-between p-4 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10"
                            >
                                <div>
                                    <p className="text-white font-medium">Ticket #{index + 1}</p>
                                    <p className="text-sm text-white/60">ID: {ticket.id}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadTicket(ticket.id)}
                                    icon={<Download size={16} />}
                                >
                                    Download
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Important Information */}
            <Card className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Important Information</h3>
                <ul className="space-y-3 text-sm text-white/80">
                    <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>
              Please carry a valid ID proof and your e-ticket (digital or printed) to the event
            </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>Entry is subject to security checks and verification at the venue</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>
              Tickets are non-refundable and non-transferable as per our cancellation policy
            </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>Please arrive at least 30 minutes before the event starts</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>
              For any queries, contact our support team at support@collegefest.com
            </span>
                    </li>
                </ul>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    variant="primary"
                    fullWidth
                    onClick={handleViewTickets}
                    icon={<TicketIcon size={20} />}
                >
                    View My Tickets
                </Button>
                <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/events')}
                >
                    Browse More Events
                </Button>
            </div>
        </div>
    );
};

export default BookingConfirmation;
